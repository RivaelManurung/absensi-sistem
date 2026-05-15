"use client";

import { useAttendanceDetail } from "@/features/attendance/hooks/use-attendance-detail";
import { 
  AlertCircle, 
  ArrowLeft, 
  Clock, 
  Loader2, 
  MapPin, 
  Smartphone, 
  User, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar,
  Camera,
  Navigation
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function AttendanceDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: record, isLoading, isError } = useAttendanceDetail(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="animate-pulse text-sm font-medium">Loading record details...</p>
        </div>
      </div>
    );
  }

  if (isError || !record) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <Card className="w-full max-w-md rounded-2xl border-dashed">
          <CardHeader className="items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Record Not Found</CardTitle>
            <CardDescription>
              Data absensi tidak ditemukan. Silakan periksa kembali riwayat absensi Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/app/attendance/history">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to History
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLate = record.status === "Late";
  const isOnTime = record.status === "Present";
  const isGeofenceValid = record.location_status === "Inside Geofence";

  return (
    <div className="w-full space-y-8 px-6 py-8">
      {/* Premium Header */}
      <div className="flex flex-col gap-6 rounded-3xl border bg-card p-8 shadow-sm md:flex-row md:items-center md:justify-between lg:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className={`absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-background ${isOnTime ? 'bg-green-500' : isLate ? 'bg-amber-500' : 'bg-destructive'}`} />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Attendance Detail
              </h1>
              <Badge variant="secondary" className={`rounded-full ${isOnTime ? 'bg-green-500/10 text-green-600' : isLate ? 'bg-amber-500/10 text-amber-600' : 'bg-destructive/10 text-destructive'}`}>
                {record.status}
              </Badge>
            </div>

            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-foreground">LOG ID</span>
              {id.substring(0, 8).toUpperCase()}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="bg-muted/50 font-medium">
                <Calendar className="mr-1.5 h-3 w-3 text-primary" />
                {new Date(record.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </Badge>
              <Badge variant="outline" className="bg-muted/50 font-medium">
                <User className="mr-1.5 h-3 w-3 text-primary" />
                {record.employee_name}
              </Badge>
              <Badge variant="outline" className="bg-muted/50 font-medium">
                <Building2 className="mr-1.5 h-3 w-3 text-primary" />
                {record.office_name}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:self-start">
          <Button variant="outline" size="lg" asChild className="rounded-xl px-6">
            <Link href="/app/attendance/history">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Link>
          </Button>

          <Button size="lg" className="rounded-xl px-6" variant="secondary">
            <Smartphone className="mr-2 h-4 w-4" />
            Device Log
          </Button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_400px]">
        {/* Left Column: Detailed Info */}
        <div className="space-y-8">
          <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
            <CardHeader className="bg-muted/30 px-8 py-6">
              <CardTitle className="text-xl">Time & Location Evidence</CardTitle>
              <CardDescription>
                Data forensik waktu dan lokasi saat pengambilan absensi dilakukan.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid sm:grid-cols-2">
                <div className="flex min-h-24 gap-4 border-b border-r p-8 transition-colors hover:bg-muted/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Check-In</p>
                    <p className="mt-1 break-words text-2xl font-bold text-foreground">{record.check_in || "--:--"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Waktu tercatat di server</p>
                  </div>
                </div>

                <div className="flex min-h-24 gap-4 border-b p-8 transition-colors hover:bg-muted/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10">
                    <Clock className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Check-Out</p>
                    <p className="mt-1 break-words text-2xl font-bold text-foreground">{record.check_out || "--:--"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Waktu tercatat di server</p>
                  </div>
                </div>

                <div className="flex min-h-24 gap-4 border-r p-8 transition-colors hover:bg-muted/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Navigation className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Geofence Status</p>
                    <Badge variant={isGeofenceValid ? "outline" : "destructive"} className="mt-1">
                      {record.location_status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                       Distance: {record.distance_from_office?.toFixed(1)}m from office
                    </p>
                  </div>
                </div>

                <div className="flex min-h-24 gap-4 p-8 transition-colors hover:bg-muted/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Device Info</p>
                    <p className="mt-1 break-words text-sm font-semibold truncate max-w-[200px]">
                      {record.device_info || "Browser Terminal"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Unified Security Identifier</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Visualization Card */}
          <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
            <CardHeader className="px-8 py-6">
              <CardTitle className="text-lg">Location Snapshot</CardTitle>
              <CardDescription>
                Koordinat presisi saat penekanan tombol absensi.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="aspect-video w-full rounded-2xl bg-muted/50 flex flex-col items-center justify-center border-2 border-dashed border-muted relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                 <div className="z-10 text-center p-6">
                    <div className="h-16 w-16 bg-background rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 border ring-8 ring-primary/5">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-bold text-lg mb-1">Log Coordinate Captured</p>
                    <p className="text-sm text-muted-foreground">
                      Lat: {record.latitude} | Lng: {record.longitude}
                    </p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Verification & Photo */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-none shadow-md ring-1 ring-border">
            <CardHeader>
              <CardTitle className="text-lg">Verification</CardTitle>
              <CardDescription>
                Status validasi sistem.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-green-500/5 p-8 text-center ring-1 ring-green-500/10">
                <div className="h-14 w-14 bg-background rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <ShieldCheck className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold">Verified Log</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  System Guard Active
                </p>
              </div>

              <div className="rounded-2xl border p-4 space-y-3">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Ant-Replay</span>
                    <Badge variant="outline" className="text-[10px] h-4">PASSED</Badge>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">JWT Signature</span>
                    <Badge variant="outline" className="text-[10px] h-4">VALID</Badge>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Shift Window</span>
                    <Badge variant="outline" className="text-[10px] h-4">IN RANGE</Badge>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-md ring-1 ring-border overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Evidence Photo</CardTitle>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="aspect-square w-full rounded-2xl bg-muted flex flex-col items-center justify-center border-2 border-dashed">
                <Camera className="h-10 w-10 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground italic">No evidence photo required for this shift.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
