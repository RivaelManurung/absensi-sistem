"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Edit3, Loader2, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShiftForm } from "@/features/shifts/components/shift-form";
import { useShift } from "@/features/shifts/hooks/use-shift";
import { useUpdateShift } from "@/features/shifts/hooks/use-update-shift";

export default function EditShiftPage() {
  const { id } = useParams() as { id: string };

  const { data: shift, isLoading: isFetching } = useShift(id);
  const updateMutation = useUpdateShift();

  if (isFetching) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="animate-pulse text-sm font-medium">Loading shift form...</p>
        </div>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <Card className="w-full max-w-md rounded-2xl border-dashed">
          <CardHeader className="items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Clock className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Shift Not Found</CardTitle>
            <CardDescription>
              Data shift tidak ditemukan atau gagal dimuat.
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
            <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-background bg-primary text-primary-foreground shadow-lg">
                <Timer className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Edit Shift
              </h1>
            </div>

            <p className="text-sm font-medium text-muted-foreground max-w-lg">
              Sesuaikan jam kerja, toleransi keterlambatan, dan pengaturan jadwal untuk shift{" "}
              <span className="font-bold text-foreground underline decoration-primary/30 underline-offset-4">
                {shift.name}
              </span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:self-start">
          <Button variant="outline" size="lg" asChild className="rounded-xl px-6">
            <Link href={`/admin/shifts/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Detail
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
          <CardHeader className="bg-muted/30 px-8 py-6">
            <CardTitle className="text-xl">Shift Configuration Form</CardTitle>
            <CardDescription>
              Perubahan pada shift akan mempengaruhi seluruh karyawan yang terdaftar pada jadwal ini.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 lg:p-10">
            <div className="mx-auto max-w-4xl">
              <ShiftForm
                initialData={shift}
                onSubmit={(data) => updateMutation.mutate({ id, payload: data })}
                isLoading={updateMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
