"use client";

import { useOffice } from "@/features/offices/hooks/use-office";
import { 
  AlertCircle, 
  ArrowLeft, 
  Building2, 
  Edit, 
  Globe, 
  Loader2, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  Trash2, 
  Users 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { useDeleteOffice } from "@/features/offices/hooks/use-delete-office";
import { toastHelper } from "@/lib/toast";

export default function OfficeDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: office, isLoading, isError } = useOffice(id);
  const deleteMutation = useDeleteOffice();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toastHelper.success("Office deleted", "The office location has been removed successfully.");
      router.push("/admin/offices");
    } catch (err: any) {
      toastHelper.error("Delete failed", err.response?.data?.message || "Could not delete the office.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="animate-pulse text-sm font-medium">Loading office details...</p>
        </div>
      </div>
    );
  }

  if (isError || !office) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <Card className="w-full max-w-md rounded-2xl border-dashed">
          <CardHeader className="items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Office Not Found</CardTitle>
            <CardDescription>
              Data kantor tidak ditemukan atau gagal dimuat. Silakan periksa koneksi atau ID yang dimasukkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/offices">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Offices
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 px-6 py-8">
      {/* Premium Header */}
      <div className="flex flex-col gap-6 rounded-3xl border bg-card p-8 shadow-sm md:flex-row md:items-center md:justify-between lg:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner">
              <Building2 className="h-12 w-12" />
            </div>
            <div className={`absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-background ${office.status === 'Active' ? 'bg-green-500' : 'bg-destructive'}`} />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {office.name}
              </h1>
              <Badge variant="secondary" className={`rounded-full ${office.status === 'Active' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : 'bg-destructive/10 text-destructive hover:bg-destructive/20'}`}>
                {office.status}
              </Badge>
            </div>

            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-foreground">CODE</span>
              {office.code}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="bg-muted/50 font-medium">
                <MapPin className="mr-1.5 h-3 w-3 text-primary" />
                {office.address?.split(',')[0]}
              </Badge>
              <Badge variant="outline" className="bg-muted/50 font-medium">
                <Navigation className="mr-1.5 h-3 w-3 text-primary" />
                {office.radius_meter}m Radius
              </Badge>
              <Badge variant="outline" className="bg-muted/50 font-medium">
                <Users className="mr-1.5 h-3 w-3 text-primary" />
                {office.total_employees || 0} Employees
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:self-start">
          <Button variant="outline" size="lg" asChild className="rounded-xl px-6">
            <Link href={`/admin/offices/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Office
            </Link>
          </Button>

          <Button
            variant="destructive"
            size="lg"
            className="rounded-xl px-6"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_400px]">
        {/* Left Column: Detailed Info */}
        <div className="space-y-8">
          <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
            <CardHeader className="bg-muted/30 px-8 py-6">
              <CardTitle className="text-xl">Office Location Profile</CardTitle>
              <CardDescription>
                Detail koordinat geografis dan konfigurasi geofencing kantor.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid sm:grid-cols-2">
                <div className="flex min-h-24 gap-4 border-b border-r p-8 transition-colors hover:bg-muted/30 sm:border-b-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Address</p>
                    <p className="mt-1 break-words text-sm font-semibold">{office.address}</p>
                  </div>
                </div>

                <div className="flex min-h-24 gap-4 p-8 transition-colors hover:bg-muted/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Navigation className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Coordinates</p>
                    <p className="mt-1 break-words text-sm font-semibold font-mono">
                      {office.latitude.toFixed(6)}, {office.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>

                <div className="flex min-h-24 gap-4 border-t border-r p-8 transition-colors hover:bg-muted/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Radius Limit</p>
                    <p className="mt-1 break-words text-sm font-semibold">
                      {office.radius_meter} Meters
                    </p>
                  </div>
                </div>

                <div className="flex min-h-24 gap-4 border-t p-8 transition-colors hover:bg-muted/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Employee Count</p>
                    <p className="mt-1 break-words text-sm font-semibold">
                      {office.total_employees || 0} Registered Employees
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Visualization Card */}
          <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
            <CardHeader className="px-8 py-6">
              <CardTitle className="text-lg">Geofence Visualization</CardTitle>
              <CardDescription>
                Area yang diizinkan untuk melakukan absensi (Radius: {office.radius_meter}m).
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="aspect-video w-full rounded-2xl bg-muted/50 flex flex-col items-center justify-center border-2 border-dashed border-muted relative overflow-hidden">
                 {/* Placeholder for real map */}
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                 <div className="z-10 text-center p-6">
                    <div className="h-16 w-16 bg-background rounded-full flex items-center justify-center shadow-lg mx-auto mb-4 border ring-8 ring-primary/5">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-bold text-lg mb-1">Office Geofence Active</p>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Karyawan hanya dapat melakukan check-in jika berada dalam radius {office.radius_meter} meter dari titik koordinat ini.
                    </p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Performance Summary */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-none shadow-md ring-1 ring-border">
            <CardHeader>
              <CardTitle className="text-lg">Operational Status</CardTitle>
              <CardDescription>
                Ringkasan operasional kantor hari ini.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-primary/5 p-8 text-center ring-1 ring-primary/10">
                <div className="h-14 w-14 bg-background rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <p className="text-2xl font-bold">Safe & Active</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Security Guard
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border bg-background p-5 text-center transition-all hover:border-primary/30">
                  <p className="text-2xl font-bold">12</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    Present Today
                  </p>
                </div>

                <div className="rounded-2xl border bg-background p-5 text-center transition-all hover:border-primary/30">
                  <p className="text-2xl font-bold">3</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    Late Entries
                  </p>
                </div>
              </div>

              <Button className="w-full rounded-xl" variant="secondary" asChild>
                <Link href={`/admin/reports?office_id=${id}`}>
                  View Attendance Reports
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-lg shadow-primary/20 border-none">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl">Office QR Code</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <p className="text-sm opacity-90 mb-6">
                Gunakan QR Code statis untuk terminal absensi fisik di lokasi kantor ini.
              </p>
              <Button variant="secondary" className="w-full rounded-xl bg-white text-primary hover:bg-white/90" asChild>
                <Link href={`/app/admin/offices/${id}/qr`}>
                  Generate Terminal QR
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Office"
        description={`Are you sure you want to delete ${office.name}? This action cannot be undone.`}
      />
    </div>
  );
}
