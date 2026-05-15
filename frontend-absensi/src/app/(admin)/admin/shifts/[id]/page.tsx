"use client";

import { useShift } from "@/features/shifts/hooks/use-shift";
import { 
  AlertCircle, 
  ArrowLeft, 
  Clock, 
  Edit, 
  Loader2, 
  Trash2, 
  Timer, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Briefcase
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
import { useDeleteShift } from "@/features/shifts/hooks/use-delete-shift";
import { toastHelper } from "@/lib/toast";

export default function ShiftDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: shift, isLoading, isError } = useShift(id);
  const deleteMutation = useDeleteShift();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toastHelper.success("Shift deleted", "The shift schedule has been removed successfully.");
      router.push("/admin/shifts");
    } catch (err: any) {
      toastHelper.error("Delete failed", err.response?.data?.message || "Could not delete the shift.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="animate-pulse text-sm font-medium">Loading shift details...</p>
        </div>
      </div>
    );
  }

  if (isError || !shift) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <Card className="w-full max-w-md rounded-2xl border-dashed">
          <CardHeader className="items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Shift Not Found</CardTitle>
            <CardDescription>
              Data shift tidak ditemukan atau gagal dimuat. Silakan periksa koneksi atau ID yang dimasukkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/shifts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shifts
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
              <Clock className="h-12 w-12" />
            </div>
            <div className={`absolute -right-1 -top-1 h-5 w-5 rounded-full border-4 border-background bg-green-500`} />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {shift.name}
              </h1>
              <Badge variant="secondary" className="rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20">
                Active
              </Badge>
            </div>

            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-foreground">SHIFT ID</span>
              {id.substring(0, 8).toUpperCase()}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="bg-muted/50 font-medium">
                <Timer className="mr-1.5 h-3 w-3 text-primary" />
                {shift.start_time} - {shift.end_time}
              </Badge>
              <Badge variant="outline" className="bg-muted/50 font-medium">
                <Calendar className="mr-1.5 h-3 w-3 text-primary" />
                Mon - Fri (Default)
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:self-start">
          <Button variant="outline" size="lg" asChild className="rounded-xl px-6">
            <Link href={`/admin/shifts/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Shift
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
              <CardTitle className="text-xl">Shift Schedule Detail</CardTitle>
              <CardDescription>
                Konfigurasi waktu kerja dan toleransi keterlambatan.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid sm:grid-cols-2">
                <div className="flex min-h-24 gap-4 border-b border-r p-8 transition-colors hover:bg-muted/30 sm:border-b-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Check-In Time</p>
                    <p className="mt-1 break-words text-2xl font-bold text-foreground">{shift.start_time}</p>
                    <p className="text-xs text-muted-foreground mt-1">Waktu mulai kerja standar</p>
                  </div>
                </div>

                <div className="flex min-h-24 gap-4 p-8 transition-colors hover:bg-muted/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Check-Out Time</p>
                    <p className="mt-1 break-words text-2xl font-bold text-foreground">{shift.end_time}</p>
                    <p className="text-xs text-muted-foreground mt-1">Waktu selesai kerja standar</p>
                  </div>
                </div>

                <div className="flex min-h-24 gap-4 border-t border-r p-8 transition-colors hover:bg-muted/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <Timer className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Duration</p>
                    <p className="mt-1 break-words text-sm font-semibold">
                      8 Hours 0 Minutes
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Estimasi jam kerja bersih</p>
                  </div>
                </div>

                <div className="flex min-h-24 gap-4 border-t p-8 transition-colors hover:bg-muted/30">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Late Tolerance</p>
                    <p className="mt-1 break-words text-sm font-semibold">
                      15 Minutes
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Batas toleransi keterlambatan</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <p className="text-3xl font-bold">45</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-semibold">Employees</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <p className="text-3xl font-bold text-primary">98%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-semibold">Compliance</p>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm col-span-2 sm:col-span-1">
              <p className="text-3xl font-bold text-amber-600">5.2%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-semibold">Late Rate</p>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Meta */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-none shadow-md ring-1 ring-border">
            <CardHeader>
              <CardTitle className="text-lg">Shift Visibility</CardTitle>
              <CardDescription>
                Informasi tentang penggunaan shift ini.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-primary/5 p-8 text-center ring-1 ring-primary/10">
                <div className="h-14 w-14 bg-background rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <p className="text-2xl font-bold">Standard Shift</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Global Category
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created At</span>
                  <span className="font-medium">12 Jan 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">05 Mar 2024</span>
                </div>
              </div>

              <Button className="w-full rounded-xl" variant="secondary" asChild>
                <Link href={`/admin/employees?shift_id=${id}`}>
                  View Assigned Employees
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="rounded-3xl bg-amber-500 p-6 text-white shadow-lg shadow-amber-500/20">
            <h3 className="text-lg font-bold">Critical Note</h3>
            <p className="mt-2 text-sm opacity-90">
              Perubahan pada jam kerja shift akan berdampak langsung pada perhitungan keterlambatan seluruh karyawan yang terdaftar.
            </p>
          </div>
        </div>
      </div>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Shift"
        description={`Are you sure you want to delete ${shift.name}? This action cannot be undone.`}
      />
    </div>
  );
}
