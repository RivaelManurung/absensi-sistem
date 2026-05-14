"use client";

import { useShift } from "@/features/shifts/hooks/use-shift";
import { ShiftDetailCard } from "@/features/shifts/components/shift-detail-card";
import { ChevronLeft, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ShiftDeleteDialog } from "@/features/shifts/components/shift-delete-dialog";
import { useDeleteShift } from "@/features/shifts/hooks/use-delete-shift";

export default function ShiftDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: shift, isLoading, isError } = useShift(id);
  const deleteMutation = useDeleteShift();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !shift) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Shift not found or failed to load.</p>
        <Link href="/shifts">
          <Button variant="outline">Back to Shifts</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push("/shifts");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/shifts">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Shift Details</h1>
            <p className="text-sm text-muted-foreground">
              Detailed configuration for {shift.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/shifts/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="max-w-3xl">
        <ShiftDetailCard shift={shift} />
      </div>

      <ShiftDeleteDialog 
        shiftName={shift.name}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
