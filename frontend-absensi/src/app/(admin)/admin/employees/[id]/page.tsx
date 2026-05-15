"use client";

import { useEmployee } from "@/features/employees/hooks/use-employee";
import { EmployeeDetailCard } from "@/features/employees/components/employee-detail-card";
import { ChevronLeft, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { EmployeeDeleteDialog } from "@/features/employees/components/employee-delete-dialog";
import { useDeleteEmployee } from "@/features/employees/hooks/use-delete-employee";

export default function EmployeeDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: employee, isLoading, isError } = useEmployee(id);
  const deleteMutation = useDeleteEmployee();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const employeeData = employee;

  if (isError || !employeeData) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Employee not found or failed to load.</p>
        <Link href="/admin/employees">
          <Button variant="outline">Back to Employees</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push("/admin/employees");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/employees">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Employee Details</h1>
            <p className="text-sm text-muted-foreground">
              Detailed information for {employeeData.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/employees/${id}/edit`}>
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
        <EmployeeDetailCard employee={employeeData} />
      </div>

      <EmployeeDeleteDialog 
        employeeName={employeeData.name}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
