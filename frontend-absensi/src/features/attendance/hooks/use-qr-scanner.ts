import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseQRScannerOptions {
  onScanSuccess: (data: string) => Promise<void>;
  cooldownMs?: number;
}

export const useQRScanner = ({ onScanSuccess, cooldownMs = 3000 }: UseQRScannerOptions) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const lastScanTime = useRef<number>(0);

  const playSuccessSound = useCallback(() => {
    try {
      const audio = new Audio('/sounds/scan-success.mp3');
      audio.play().catch(() => {
        // Ignore if sound fails (e.g. user hasn't interacted yet)
      });
    } catch (e) {
      // Ignore
    }
  }, []);

  const triggerHaptic = useCallback(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }, []);

  const handleScan = useCallback(async (result: unknown) => {
    const scanResult = result as { rawValue: string }[];
    if (isProcessing || isLocked) return;

    const now = Date.now();
    if (now - lastScanTime.current < cooldownMs) return;

    if (!scanResult || !scanResult[0]?.rawValue) return;
    const decodedText = scanResult[0].rawValue;

    setIsProcessing(true);
    setIsLocked(true);
    lastScanTime.current = now;

    try {
      playSuccessSound();
      triggerHaptic();
      await onScanSuccess(decodedText);
    } catch (err: unknown) {
      console.error('Scan processing error:', err);
      // Let onScanSuccess handle the toast
    } finally {
      setIsProcessing(false);
      // Keep locked for cooldown
      setTimeout(() => {
        setIsLocked(false);
      }, cooldownMs);
    }
  }, [isProcessing, isLocked, onScanSuccess, cooldownMs, playSuccessSound, triggerHaptic]);

  return {
    isProcessing,
    isLocked,
    handleScan,
  };
};
