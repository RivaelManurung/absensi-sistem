'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { QRScanner } from '@/components/qr/qr-scanner';
import { qrService } from '@/features/attendance/qr.service';
import { useAuth } from '@/features/auth/use-auth';
import { toastHelper } from '@/lib/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideCheckCircle, LucideAlertTriangle, LucideLoader2 } from 'lucide-react';

export default function QRAttendancePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleScan = async (decodedText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Get location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // Try Check-In first
      try {
        const res = await qrService.checkIn({
          qr_token: decodedText,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          device_id: 'browser_id', // Should be a real persistent ID
        });
        setResult({ success: true, message: 'Check-in successful' });
        toastHelper.success('Check-in successful', 'Your entry has been recorded.');
      } catch (err: unknown) {
        // If check-in fails, try check-out (backend will validate which session it is)
        try {
          await qrService.checkOut({
            qr_token: decodedText,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            device_id: 'browser_id',
          });
          setResult({ success: true, message: 'Check-out successful' });
          toastHelper.success('Check-out successful', 'Your exit has been recorded.');
        } catch (checkoutErr: unknown) {
          const axiosError = checkoutErr as AxiosError<{ message?: string }>;
          const errMsg = axiosError.response?.data?.message || 'Failed to process QR code';
          setResult({ success: false, message: errMsg });
          toastHelper.error('Scan failed', errMsg);
        }
      }
    } catch (err: unknown) {
      toastHelper.error('Location error', (err as Error).message);
      setResult({ success: false, message: 'Location access required' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="container max-w-md mx-auto py-12 px-4">
        <Card className="text-center animate-in fade-in zoom-in duration-300">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {result.success ? (
                <LucideCheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <LucideAlertTriangle className="h-16 w-16 text-destructive" />
              )}
            </div>
            <CardTitle>{result.success ? 'Success!' : 'Failed'}</CardTitle>
            <CardDescription>{result.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push('/app/attendance')}>
                Back to Attendance
              </Button>
              <Button variant="outline" onClick={() => setResult(null)}>
                Scan Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">QR Attendance</h1>
        <p className="text-muted-foreground mt-2">
          Scan the dynamic QR code provided by the office or security.
        </p>
      </div>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <LucideLoader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Processing attendance...</p>
          <p className="text-sm text-muted-foreground">Validating location and security rules.</p>
        </div>
      ) : (
        <QRScanner 
          onScan={handleScan} 
          description="Place the office QR code within the frame"
        />
      )}

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Rules</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Geolocation and device ID are recorded for each scan.</p>
            <p>• QR codes are dynamic and expire after a short period.</p>
            <p>• Anti-replay measures are active to prevent duplicate scans.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
