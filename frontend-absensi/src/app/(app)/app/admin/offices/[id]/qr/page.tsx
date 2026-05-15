'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { qrService } from '@/features/attendance/qr.service';
import { QRResponse } from '@/types/qr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LucideQrCode, LucideDownload, LucideRefreshCcw } from 'lucide-react';

export default function OfficeQRPage() {
  const params = useParams();
  const router = useRouter();
  const officeId = params.id as string;

  const [qrData, setQrData] = useState<QRResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ttl, setTtl] = useState(300); // 5 minutes
  const [purpose, setPurpose] = useState<'check_in' | 'check_out' | 'both'>('both');

  const generateQR = async () => {
    setIsLoading(true);
    try {
      const data = await qrService.generateOfficeQR(officeId, {
        purpose,
        ttl_seconds: ttl,
      });
      setQrData(data);
      toast.success('Office QR Session generated');
    } catch (err) {
      toast.error('Failed to generate QR session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrData?.qr_image_data_url) return;
    const link = document.createElement('a');
    link.href = qrData.qr_image_data_url;
    link.download = `OfficeQR_${officeId.substring(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Office Dynamic QR</h1>
        <p className="text-muted-foreground mt-2">
          Generate a temporary QR code for employees to scan.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Session Configuration</CardTitle>
            <CardDescription>Set the purpose and expiration of the QR code.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Purpose</Label>
              <Select value={purpose} onValueChange={(v) => setPurpose(v as 'check_in' | 'check_out' | 'both')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both Check-In & Out</SelectItem>
                  <SelectItem value="check_in">Check-In Only</SelectItem>
                  <SelectItem value="check_out">Check-Out Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>TTL (Seconds)</Label>
              <Input 
                type="number" 
                value={ttl} 
                onChange={(e) => setTtl(parseInt(e.target.value))} 
                min={10} 
                max={3600}
              />
              <p className="text-xs text-muted-foreground italic">Max 1 hour (3600s)</p>
            </div>

            <Button 
              className="w-full gap-2" 
              onClick={generateQR} 
              disabled={isLoading}
            >
              <LucideRefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {qrData ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle>Active QR Code</CardTitle>
              <CardDescription>
                Expires at: {new Date(qrData.expires_at!).toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
                <img 
                  src={qrData.qr_image_data_url} 
                  alt="Office QR"
                  className="w-64 h-64"
                />
              </div>
              <div className="flex w-full gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleDownload}>
                  <LucideDownload className="h-4 w-4" />
                  Download
                </Button>
                <Button className="flex-1 gap-2" variant="default" onClick={() => window.print()}>
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex items-center justify-center border-dashed">
            <div className="text-center p-12">
              <LucideQrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">QR code will appear here after generation.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
