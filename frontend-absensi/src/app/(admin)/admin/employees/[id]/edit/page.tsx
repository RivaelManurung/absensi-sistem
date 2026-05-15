"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Edit3, Loader2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmployeeForm } from "@/features/employees/components/employee-form";
import { useEmployee } from "@/features/employees/hooks/use-employee";
import { useUpdateEmployee } from "@/features/employees/hooks/use-update-employee";

export default function EditEmployeePage() {
  const { id } = useParams() as { id: string };

  const { data: employee, isLoading: isFetching } = useEmployee(id);
  const updateMutation = useUpdateEmployee();

  if (isFetching) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="animate-pulse text-sm font-medium">Loading employee form...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <Card className="w-full max-w-md rounded-2xl border-dashed">
          <CardHeader className="items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <UserRound className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Employee Not Found</CardTitle>
            <CardDescription>
              Data employee tidak ditemukan atau gagal dimuat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/employees">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Employees
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <Edit3 className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Edit Employee
              </h1>
            </div>

            <p className="text-sm font-medium text-muted-foreground max-w-lg">
              Perbarui informasi identitas, jabatan, dan penempatan kerja untuk{" "}
              <span className="font-bold text-foreground underline decoration-primary/30 underline-offset-4">
                {employee.full_name}
              </span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:self-start">
          <Button variant="outline" size="lg" asChild className="rounded-xl px-6">
            <Link href={`/admin/employees/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        <Card className="overflow-hidden rounded-3xl border-none shadow-md ring-1 ring-border">
          <CardHeader className="bg-muted/30 px-8 py-6">
            <CardTitle className="text-xl">Employee Information Form</CardTitle>
            <CardDescription>
              Pastikan seluruh kolom bertanda bintang (*) diisi dengan data yang valid.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 lg:p-10">
            <EmployeeForm
              initialData={employee}
              onSubmit={(data) => updateMutation.mutate({ id, payload: data })}
              isLoading={updateMutation.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}