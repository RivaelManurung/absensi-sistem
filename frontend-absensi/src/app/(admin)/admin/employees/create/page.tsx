"use client";

import Link from "next/link";
import { ArrowLeft, Plus, UserPlus, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmployeeForm } from "@/features/employees/components/employee-form";
import { useCreateEmployee } from "@/features/employees/hooks/use-create-employee";

export default function CreateEmployeePage() {
  const createMutation = useCreateEmployee();

  return (
    <div className="w-full space-y-8 px-6 py-8">
      {/* Premium Header */}
      <div className="flex flex-col gap-6 rounded-3xl border bg-card p-8 shadow-sm md:flex-row md:items-center md:justify-between lg:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner">
              <UserRound className="h-12 w-12" />
            </div>
            <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-background bg-primary text-primary-foreground shadow-lg">
                <UserPlus className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Add New Employee
              </h1>
            </div>

            <p className="text-sm font-medium text-muted-foreground max-w-lg">
              Daftarkan employee baru ke dalam sistem. Pastikan informasi email dan ID unik.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:self-start">
          <Button variant="outline" size="lg" asChild className="rounded-xl px-6">
            <Link href="/admin/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
          <CardHeader className="bg-muted/30 px-8 py-6">
            <CardTitle className="text-xl">Registration Form</CardTitle>
            <CardDescription>
              Isi data diri dan penempatan kerja untuk karyawan baru.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 lg:p-10">
            <EmployeeForm
              onSubmit={(data) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
