"use client";

import { useEmployee } from "@/features/employees/hooks/use-employee";
import { EmployeeForm } from "@/features/employees/components/employee-form";
import { useUpdateEmployee } from "@/features/employees/hooks/use-update-employee";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function EditEmployeePage() {
  const { id } = useParams() as { id: string };
  const { data: employee, isLoading: isFetching } = useEmployee(id);
  const updateMutation = useUpdateEmployee();

  if (isFetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const employeeData = employee;

  if (!employeeData) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Employee not found.</p>
        <Link href="/admin/employees">
          <Button variant="outline">Back to Employees</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/employees/${id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Employee</h1>
          <p className="text-sm text-muted-foreground">
            Update employee information for {employeeData.name}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <EmployeeForm 
          initialData={employeeData}
          onSubmit={(data) => updateMutation.mutate({ id, payload: data })} 
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  );
}
