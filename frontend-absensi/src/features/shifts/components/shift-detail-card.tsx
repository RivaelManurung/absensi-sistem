"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shift } from "../types/shift.type";
import { Separator } from "@/components/ui/separator";
import { Clock, Timer, Coffee, CalendarCheck } from "lucide-react";

interface ShiftDetailCardProps {
  shift: Shift;
}

export function ShiftDetailCard({ shift }: ShiftDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{shift.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{shift.code}</p>
          </div>
          <Badge variant={shift.status === "Active" ? "outline" : "destructive"}>
            {shift.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Clock className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Start Time</p>
              <p className="text-sm font-medium">{shift.start_time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">End Time</p>
              <p className="text-sm font-medium">{shift.end_time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Timer className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Late Tolerance</p>
              <p className="text-sm">{shift.late_tolerance_minutes} minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Coffee className="size-4 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Break Duration</p>
              <p className="text-sm">{shift.break_duration_minutes} minutes</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Usage Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CalendarCheck className="size-4 text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Assigned Employees</span>
              </div>
              <p className="text-2xl font-bold">42</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Timer className="size-4 text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Average Lateness</span>
              </div>
              <p className="text-2xl font-bold">4.5m</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
