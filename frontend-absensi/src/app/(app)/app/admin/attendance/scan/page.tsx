'use client';

import React, { useState, useEffect } from 'react';
import { QRScanner } from '@/components/qr/qr-scanner';
import { qrService } from '@/features/attendance/qr.service';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideCheckCircle, LucideAlertTriangle, LucideLoader2, LucideUserCheck, LucideUserX } from 'lucide-react';
import { AxiosError } from 'axios';
import { format } from 'date-fns';

export default function AdminScanPage() {
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [action, setAction] = useState<'check_in' | 'check_out'>('check_in');
  const [result, setResult] = useState<{ success: boolean; message: string; data?: unknown } | null>(null);

  const handleScan = async (decodedText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Get location of the scanner (admin/security device)
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const res = await qrService.scanEmployee({
        employee_qr_token: decodedText,
        action: action,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        device_id: 'admin_scanner_device',
      });

      setResult({ 
        success: true, 
        message: `${action === 'check_in' ? 'Check-in' : 'Check-out'} recorded for ${(res.data as { employee: { full_name: string } }).employee.full_name}`,
        data: res.data 
      });
      toast.success('Attendance recorded');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errMsg = axiosError.response?.data?.message || 'Failed to scan employee QR';
      setResult({ success: false, message: errMsg });
      toast.error(errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (result) {
    return (
      <div className="container max-w-md mx-auto py-12 px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {result.success ? (
                <LucideCheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <LucideAlertTriangle className="h-16 w-16 text-destructive" />
              )}
            </div>
            <CardTitle>{result.success ? 'Scan Successful' : 'Scan Failed'}</CardTitle>
            <CardDescription>{result.message}</CardDescription>
          </CardHeader>
          <CardContent>
            {result.success && !!result.data && (
              <div className="mb-6 p-4 bg-muted rounded-lg text-left text-sm space-y-1">
                <p><strong>Employee:</strong> {(result.data as { employee: { full_name: string } }).employee.full_name}</p>
                <p><strong>Time:</strong> {mounted ? format(new Date(), "HH:mm:ss") : "--:--:--"}</p>
                <p><strong>Status:</strong> {(result.data as { status: string }).status}</p>
              </div>
            )}
            <Button className="w-full" onClick={() => setResult(null)}>
              Scan Next Employee
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Employee QR Scanner</h1>
        <p className="text-muted-foreground mt-2">
          Security/Admin mode: Scan employee identity QR codes.
        </p>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="check_in" onValueChange={(v) => setAction(v as 'check_in' | 'check_out')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="check_in" className="gap-2">
              <LucideUserCheck className="h-4 w-4" />
              Check-In Mode
            </TabsTrigger>
            <TabsTrigger value="check_out" className="gap-2">
              <LucideUserX className="h-4 w-4" />
              Check-Out Mode
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <LucideLoader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Verifying Employee Identity...</p>
        </div>
      ) : (
        <QRScanner 
          onScan={handleScan} 
          title={`Scanning for ${action === 'check_in' ? 'Check-In' : 'Check-Out'}`}
          description="Align the employee's QR identity within the box"
        />
      )}
    </div>
  );
}
