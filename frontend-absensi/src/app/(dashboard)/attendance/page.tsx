"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MapPin, 
  Navigation, 
  AlertTriangle,
  History,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function AttendancePage() {
  const [time, setTime] = useState(new Date());
  const [gpsStatus, setGpsStatus] = useState<"loading" | "success" | "error">("loading");
  const [location, setLocation] = useState<{ lat: string; lng: string; acc: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const gpsTimer = setTimeout(() => {
      setGpsStatus("success");
      setLocation({
        lat: "-6.2088",
        lng: "106.8456",
        acc: "12m"
      });
    }, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(gpsTimer);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Check In/Out</h1>
        <p className="text-sm text-muted-foreground">
          {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="text-center space-y-0 pb-2">
            <CardTitle className="text-5xl font-bold tracking-tighter tabular-nums py-4">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </CardTitle>
            <div className="flex justify-center">
              <Badge variant="secondary">
                Shift: Morning (08:00 - 17:00)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Current Status</span>
              </div>
              <span className="font-semibold">Not Checked In</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="size-4 text-primary" />
                <CardTitle className="text-sm font-medium">Location</CardTitle>
              </div>
              {gpsStatus === "success" && (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-500/10">
                  Verified
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {gpsStatus === "loading" ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : gpsStatus === "error" ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>GPS Error</AlertTitle>
                <AlertDescription>
                  Enable GPS permissions to check in.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Coordinates</span>
                    <p className="text-xs font-mono">{location?.lat}, {location?.lng}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Accuracy</span>
                    <p className="text-xs font-mono">{location?.acc}</p>
                  </div>
                </div>
                <div className="pt-3 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Main Office</span>
                  </div>
                  <span className="text-xs font-semibold text-green-600">45m (Inside Radius)</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full h-16 text-lg font-bold shadow-sm"
            disabled={gpsStatus !== "success"}
          >
            Check In Now
          </Button>
          <p className="text-[10px] text-center text-muted-foreground px-4 leading-relaxed">
            Your attendance will be recorded with current timestamp and GPS coordinates. 
            Make sure you are within the allowed radius.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Today&apos;s Activity</h3>
            </div>
            <Link href="/attendance/history">
              <Button variant="link" className="h-auto p-0 text-xs">View History</Button>
            </Link>
          </div>

          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-8 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Clock className="size-8 opacity-20" />
              <p className="text-xs">No activity recorded for today.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
