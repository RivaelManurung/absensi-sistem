'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { qrService } from '@/features/attendance/qr.service';
import { LucideQrCode, LucideRefreshCcw, LucideDownload, LucideLoader2 } from 'lucide-react';
import { QRResponse } from '@/types/qr';
import { toast } from 'sonner';

interface EmployeeQRCardProps {
  employeeId: string;
  employeeName: string;
}

export function EmployeeQRCard({ employeeId, employeeName }: EmployeeQRCardProps) {
  const [qrData, setQrData] = useState<QRResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = useCallback(async () => {
    setIsRegenerating(true);
    try {
      const data = await qrService.regenerateEmployeeQR(employeeId);
      setQrData(data);
      toast.success('QR Code regenerated successfully');
    } catch (err) {
      toast.error('Failed to regenerate QR Code');
    } finally {
      setIsRegenerating(false);
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchQR = async () => {
      try {
        const data = await qrService.getEmployeeQR(employeeId);
        if (isMounted) {
          setQrData(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          handleRegenerate();
        }
      }
    };

    fetchQR();
    
    return () => {
      isMounted = false;
    };
  }, [employeeId, handleRegenerate]);

  const handleDownload = () => {
    if (!qrData?.qr_image_data_url) return;
    const link = document.createElement('a');
    link.href = qrData.qr_image_data_url;
    link.download = `QR_${employeeName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card className="w-full flex items-center justify-center p-12">
        <LucideLoader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LucideQrCode className="h-5 w-5 text-primary" />
            <CardTitle>Employee Identity QR</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRegenerate} 
            disabled={isRegenerating}
            className="gap-2"
          >
            <LucideRefreshCcw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>
        <CardDescription>
          This QR code acts as your digital identity for office attendance scans.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-b-xl">
        {qrData?.qr_image_data_url ? (
          <>
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border-2 border-primary/10">
              <img 
                src={qrData.qr_image_data_url} 
                alt={`QR for ${employeeName}`}
                className="w-48 h-48"
              />
            </div>
            <div className="text-center mb-6">
              <p className="font-bold text-lg">{employeeName}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Employee ID: {employeeId.substring(0, 8)}</p>
            </div>
            <Button onClick={handleDownload} className="w-full gap-2">
              <LucideDownload className="h-4 w-4" />
              Download QR Card
            </Button>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No active QR found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
