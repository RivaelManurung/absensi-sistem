"use client";

import { useOffice } from "@/features/offices/hooks/use-office";
import { OfficeForm } from "@/features/offices/components/office-form";
import { useUpdateOffice } from "@/features/offices/hooks/use-update-office";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function EditOfficePage() {
  const { id } = useParams() as { id: string };
  const { data: office, isLoading: isFetching } = useOffice(id);
  const updateMutation = useUpdateOffice();

  if (isFetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!office) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Office not found.</p>
        <Link href="/admin/offices">
          <Button variant="outline">Back to Offices</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/offices/${id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Office</h1>
          <p className="text-sm text-muted-foreground">
            Update office configuration for {office.name}
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <OfficeForm 
          initialData={office}
          onSubmit={(data) => updateMutation.mutate({ id, payload: data })} 
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  );
}
