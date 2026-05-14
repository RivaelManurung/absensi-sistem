"use client";

import { useAttendanceDetail } from "@/features/attendance/hooks/use-attendance-detail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Loader2, MapPin, Clock, Smartphone, User, Building } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function AttendanceDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: record, isLoading, isError } = useAttendanceDetail(id);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !record) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Attendance record not found.</p>
        <Link href="/attendance/history">
          <Button variant="outline">Back to History</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/attendance/history">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Attendance Record</h1>
          <p className="text-sm text-muted-foreground">
            Details for {record.employee_name} on {new Date(record.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Log Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Check In</p>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-primary" />
                    <span className="text-xl font-semibold">{record.check_in || "--:--"}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Check Out</p>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-primary" />
                    <span className="text-xl font-semibold">{record.check_out || "--:--"}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Location Status</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <Badge variant={record.location_status === "Inside Geofence" ? "outline" : "destructive"}>
                      {record.location_status || "Unknown"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Distance from Office</p>
                  <p className="text-sm">{record.distance_from_office ? `${record.distance_from_office.toFixed(2)} meters` : "N/A"}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Device Information</p>
                  <div className="flex items-center gap-2">
                    <Smartphone className="size-4 text-muted-foreground" />
                    <p className="text-sm">{record.device_info || "Web Browser / Unknown"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Map Snapshot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center border border-dashed">
                <div className="text-center p-6">
                  <MapPin className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Location visualization for check-in</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Lat: {record.latitude || "0"} | Lng: {record.longitude || "0"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{record.employee_name}</p>
                  <p className="text-xs text-muted-foreground">{record.employee_id}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Building className="size-4 text-muted-foreground" />
                <span className="text-sm">{record.office_name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="w-fit">{record.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evidence Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center border border-dashed">
                <div className="text-center p-6 text-muted-foreground">
                  <p className="text-xs italic">No photo available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
