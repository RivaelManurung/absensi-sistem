"use client";

import { ShiftForm } from "@/features/shifts/components/shift-form";
import { useCreateShift } from "@/features/shifts/hooks/use-create-shift";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateShiftPage() {
  const createMutation = useCreateShift();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/shifts">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create Shift</h1>
          <p className="text-sm text-muted-foreground">
            Define a new work schedule for employees.
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <ShiftForm 
          onSubmit={(data) => createMutation.mutate(data)} 
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  );
}
