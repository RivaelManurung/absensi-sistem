'use client';

import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Card, CardContent } from '@/components/ui/card';
import { LucideCameraOff, LucideLoader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  onScan: (result: unknown) => void;
  isProcessing: boolean;
  isLocked: boolean;
}

export const QRScanner = ({ onScan, isProcessing, isLocked }: QRScannerProps) => {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <LucideCameraOff className="h-12 w-12 text-destructive mb-4" />
          <p className="font-semibold text-destructive mb-2">Camera Access Denied</p>
          <p className="text-sm text-muted-foreground mb-6">
            Please enable camera permissions in your browser settings to use the QR scanner.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black aspect-square max-w-md mx-auto border-4 border-muted">
      {/* Scanning Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
        {/* Animated Scanning Line */}
        {!isLocked && !isProcessing && (
          <div className="absolute w-full h-1 bg-primary/50 animate-[scan_2s_ease-in-out_infinite]" />
        )}
        
        {/* Corner Brackets */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl opacity-80" />
        <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl opacity-80" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl opacity-80" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl opacity-80" />

        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
            <LucideLoader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-white font-medium">Processing...</p>
          </div>
        )}

        {isLocked && !isProcessing && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="bg-background/90 px-4 py-2 rounded-full shadow-lg border border-primary">
              <p className="text-sm font-semibold text-primary">Cooldown Active</p>
            </div>
          </div>
        )}
      </div>

      <Scanner
        onScan={onScan}
        onError={(err: unknown) => {
          console.error('Scanner Error:', err);
          const scannerErr = err as { name?: string };
          if (scannerErr.name === 'NotAllowedError') {
            setError('denied');
          }
        }}
        styles={{
          container: {
            width: '100%',
            height: '100%',
          },
          video: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }
        }}
        components={{
          torch: true,
          onOff: true,
        }}
        allowMultiple={true}
        constraints={{
          facingMode: 'environment',
        }}
      />

      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
      `}</style>
    </div>
  );
};
