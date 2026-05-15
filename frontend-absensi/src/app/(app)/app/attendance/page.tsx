'use client';

import React, { useState, useEffect } from 'react';
import { useQRScanner } from '@/features/attendance/hooks/use-qr-scanner';
import { QRScanner } from '@/features/attendance/components/qr-scanner';
import { AttendanceResult } from '@/features/attendance/components/attendance-result';
import { AttendanceHistory } from '@/features/attendance/components/attendance-history';
import { attendanceService } from '@/features/attendance/services/attendance.service';
import { useAttendanceToday } from '@/features/attendance/use-attendance';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LucideQrCode, LucideNavigation, LucideAlertTriangle, LucideInfo } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { AttendanceRecord } from '@/features/attendance/types/attendance.type';

export default function AttendanceScannerPage() {
  const queryClient = useQueryClient();
  const [location, setLocation] = useState<{ lat: number; lng: number; acc: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    employeeName?: string;
    type?: string;
    attendance?: AttendanceRecord;
  } | null>(null);

  const { data: today, isLoading: isLoadingToday } = useAttendanceToday();

  // Get location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setTimeout(() => setGpsError('Geolocation is not supported by this browser.'), 0);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          acc: pos.coords.accuracy,
        });
        setGpsError(null);
      },
      (err) => {
        setGpsError(err.message || 'Failed to get location');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleScanSuccess = async (decodedText: string) => {
    if (!location) {
      toast.error('Location data is required for attendance.');
      return;
    }

    try {
      const res = await attendanceService.scanAttendance({
        qr_code: decodedText,
        latitude: location.lat,
        longitude: location.lng,
        accuracy: location.acc,
        device_id: 'browser_unified_scanner',
      });

      setScanResult({
        success: true,
        message: res.message,
        employeeName: res.employeeName,
        type: res.type,
        attendance: res.attendance,
      });

      toast.success(res.message);
      
      // Refresh today's record
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const errMsg = axiosError.response?.data?.message || 'Failed to process QR code';
      setScanResult({
        success: false,
        message: errMsg,
      });
      toast.error(errMsg);
      throw err; // Re-throw to trigger hook error handling if needed
    }
  };

  const { isProcessing, isLocked, handleScan } = useQRScanner({
    onScanSuccess: handleScanSuccess,
    cooldownMs: 4000,
  });

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8 px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QR Attendance</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <LucideQrCode className="h-4 w-4" /> 
            Scanner Terminal
          </p>
        </div>
        <div className="flex items-center gap-2">
          {location ? (
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 gap-1.5 py-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              GPS Active ({location.acc.toFixed(0)}m)
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 gap-1.5 py-1">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Waiting for GPS
            </Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Scanner & Result */}
        <div className="lg:col-span-7 space-y-6">
          {gpsError && (
            <Alert variant="destructive" className="animate-in slide-in-from-top-4 duration-300">
              <LucideAlertTriangle className="h-4 w-4" />
              <AlertTitle>Location Access Required</AlertTitle>
              <AlertDescription>
                {gpsError}. Attendance recording requires precise GPS location.
              </AlertDescription>
            </Alert>
          )}

          {!gpsError && !location && (
            <Alert className="bg-primary/5 border-primary/20">
              <LucideNavigation className="h-4 w-4 text-primary animate-bounce" />
              <AlertTitle>Acquiring Satellites</AlertTitle>
              <AlertDescription>
                Please wait while we capture your precise location...
              </AlertDescription>
            </Alert>
          )}

          {/* Scanner Wrapper */}
          <div className="relative group">
            <div className={`transition-opacity duration-300 ${!location || gpsError ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
              <QRScanner 
                onScan={handleScan} 
                isProcessing={isProcessing}
                isLocked={isLocked}
              />
            </div>
            
            {(!location || gpsError) && (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <div className="bg-background/90 p-6 rounded-2xl border shadow-xl max-w-xs">
                  <LucideNavigation className="h-10 w-10 text-primary mx-auto mb-4 animate-pulse" />
                  <p className="font-semibold mb-2">GPS Initialization</p>
                  <p className="text-sm text-muted-foreground">
                    Scanner will activate automatically once location is verified.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <AttendanceResult result={scanResult} />
            
            {scanResult && (
              <Button 
                variant="ghost" 
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => setScanResult(null)}
              >
                Clear Result
              </Button>
            )}
          </div>
        </div>

        {/* Right Column: History & Stats */}
        <div className="lg:col-span-5 space-y-6">
          <AttendanceHistory 
            todayAttendance={today ? (today as AttendanceRecord) : null} 
            isLoading={isLoadingToday} 
          />

          <Alert className="bg-muted/30 border-none">
            <LucideInfo className="h-4 w-4" />
            <AlertTitle className="text-sm">Usage Tips</AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground">
              Ensure you have a stable internet connection. The scanner supports both QR Codes and Barcodes.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
