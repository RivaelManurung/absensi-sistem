'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideQrCode, LucideRotateCcw } from 'lucide-react';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  title?: string;
  description?: string;
}

export function QRScanner({ onScan, title = 'QR Scanner', description }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        // We might want to stop scanning after success
        // scanner.clear(); 
      },
      (errorMessage) => {
        // Just log errors, don't set state to avoid re-renders unless critical
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error('Failed to clear scanner', error);
        });
      }
    };
  }, [onScan]);

  const handleReset = () => {
    window.location.reload(); // Simple way to reset camera if it gets stuck
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <LucideQrCode className="h-5 w-5" />
          <CardTitle>{title}</CardTitle>
        </div>
        {description && <p className="text-sm opacity-90">{description}</p>}
      </CardHeader>
      <CardContent className="p-0">
        <div id="qr-reader" className="w-full" />
        {error && (
          <div className="p-4 text-destructive text-center bg-destructive/10">
            {error}
          </div>
        )}
        <div className="p-4 flex justify-center">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
            <LucideRotateCcw className="h-4 w-4" />
            Reset Scanner
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
