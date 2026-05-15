"use client";

import { OfficeForm } from "@/features/offices/components/office-form";
import { useCreateOffice } from "@/features/offices/hooks/use-create-office";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateOfficePage() {
  const createMutation = useCreateOffice();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/offices">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create Office</h1>
          <p className="text-sm text-muted-foreground">
            Add a new office location to the system.
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <OfficeForm 
          onSubmit={(data) => createMutation.mutate(data)} 
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  );
}
