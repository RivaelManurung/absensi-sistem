"use client";

import { useOffice } from "@/features/offices/hooks/use-office";
import { OfficeDetailCard } from "@/features/offices/components/office-detail-card";
import { ChevronLeft, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { OfficeDeleteDialog } from "@/features/offices/components/office-delete-dialog";
import { useDeleteOffice } from "@/features/offices/hooks/use-delete-office";

export default function OfficeDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: office, isLoading, isError } = useOffice(id);
  const deleteMutation = useDeleteOffice();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !office) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Office not found or failed to load.</p>
        <Link href="/offices">
          <Button variant="outline">Back to Offices</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push("/offices");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/offices">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Office Details</h1>
            <p className="text-sm text-muted-foreground">
              Detailed configuration for {office.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/offices/${id}/edit`}>
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
        <OfficeDetailCard office={office} />
      </div>

      <OfficeDeleteDialog 
        officeName={office.name}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
