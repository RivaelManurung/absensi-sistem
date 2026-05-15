'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LucideCheckCircle, LucideXCircle, LucideUser, LucideClock, LucideMapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AttendanceRecord } from '../types/attendance.type';

interface AttendanceResultProps {
  result: {
    success: boolean;
    message: string;
    employeeName?: string;
    type?: string;
    attendance?: AttendanceRecord;
  } | null;
}

export const AttendanceResult = ({ result }: AttendanceResultProps) => {
  if (!result) return null;

  return (
    <Card className={`animate-in fade-in zoom-in duration-300 border-2 ${result.success ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : 'border-destructive/50 bg-destructive/5'}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          {result.success ? (
            <LucideCheckCircle className="h-16 w-16 text-green-500 animate-[bounce_1s_ease-in-out]" />
          ) : (
            <LucideXCircle className="h-16 w-16 text-destructive animate-[shake_0.5s_ease-in-out]" />
          )}
        </div>
        <CardTitle className={result.success ? 'text-green-700 dark:text-green-400' : 'text-destructive'}>
          {result.success ? 'Success!' : 'Failed'}
        </CardTitle>
        <CardDescription className="text-base font-medium">
          {result.message}
        </CardDescription>
      </CardHeader>
      
      {result.success && result.attendance && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <LucideUser className="h-3 w-3" /> Employee
              </p>
              <p className="font-semibold">{result.employeeName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Badge variant={result.type === 'check_in' ? 'default' : 'secondary'} className="h-4 px-1 text-[10px]">
                  {result.type === 'check_in' ? 'IN' : 'OUT'}
                </Badge>
              </p>
              <p className="font-semibold uppercase text-xs tracking-wider">{result.type === 'check_in' ? 'Check In' : 'Check Out'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <LucideClock className="h-3 w-3" /> Time
              </p>
              <p className="font-semibold">{result.type === 'check_in' ? result.attendance.check_in : result.attendance.check_out}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <LucideMapPin className="h-3 w-3" /> Office
              </p>
              <p className="font-semibold text-sm truncate">{result.attendance.office_name}</p>
            </div>
          </div>
        </CardContent>
      )}

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </Card>
  );
};
