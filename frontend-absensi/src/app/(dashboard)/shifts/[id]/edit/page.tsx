"use client";

import { useShift } from "@/features/shifts/hooks/use-shift";
import { ShiftForm } from "@/features/shifts/components/shift-form";
import { useUpdateShift } from "@/features/shifts/hooks/use-update-shift";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function EditShiftPage() {
  const { id } = useParams() as { id: string };
  const { data: shift, isLoading: isFetching } = useShift(id);
  const updateMutation = useUpdateShift();

  if (isFetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Shift not found.</p>
        <Link href="/shifts">
          <Button variant="outline">Back to Shifts</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/shifts/${id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Shift</h1>
          <p className="text-sm text-muted-foreground">
            Update configuration for {shift.name}
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <ShiftForm 
          initialData={shift}
          onSubmit={(data) => updateMutation.mutate({ id, payload: data })} 
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  );
}
