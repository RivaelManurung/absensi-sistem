'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideHistory, LucideClock, LucideMapPin, LucideBriefcase } from 'lucide-react';
import { AttendanceRecord } from '../types/attendance.type';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

interface AttendanceHistoryProps {
  todayAttendance: AttendanceRecord | null;
  isLoading: boolean;
}

export const AttendanceHistory = ({ todayAttendance, isLoading }: AttendanceHistoryProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LucideHistory className="h-5 w-5 text-primary" /> Today&apos;s Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-muted">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-lg flex items-center gap-2">
          <LucideHistory className="h-5 w-5 text-primary" /> Today&apos;s Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!todayAttendance ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Badge variant="outline" className="mb-2">No Records Yet</Badge>
            <p className="text-sm">Scan your QR code to record attendance.</p>
          </div>
        ) : (
          <div className="divide-y divide-muted">
            <div className="p-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <LucideClock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Check In</p>
                  <p className="text-xs text-muted-foreground">{todayAttendance.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold font-mono">{todayAttendance.check_in || '--:--'}</p>
                <Badge variant={todayAttendance.status === 'Late' ? 'destructive' : 'default'} className="h-4 text-[10px] px-1 uppercase">
                  {todayAttendance.status}
                </Badge>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-muted/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <LucideClock className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Check Out</p>
                  <p className="text-xs text-muted-foreground">{todayAttendance.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold font-mono">{todayAttendance.check_out || '--:--'}</p>
                {todayAttendance.check_out && (
                  <Badge variant="outline" className="h-4 text-[10px] px-1 uppercase">
                    Completed
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-4 bg-muted/20 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LucideBriefcase className="h-4 w-4" />
                <span className="font-medium text-foreground">Office:</span> {todayAttendance.office_name}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LucideMapPin className="h-4 w-4" />
                <span className="font-medium text-foreground">Status:</span> {todayAttendance.location_status || 'Geofenced'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
