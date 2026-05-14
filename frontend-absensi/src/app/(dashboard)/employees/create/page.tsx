"use client";

import { EmployeeForm } from "@/features/employees/components/employee-form";
import { useCreateEmployee } from "@/features/employees/hooks/use-create-employee";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateEmployeePage() {
  const createMutation = useCreateEmployee();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/employees">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create Employee</h1>
          <p className="text-sm text-muted-foreground">
            Add a new employee to your organization.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <EmployeeForm 
          onSubmit={(data) => createMutation.mutate(data as any)} 
          isLoading={createMutation.isPending}
        />
      </div>
    </div>
  );
}
