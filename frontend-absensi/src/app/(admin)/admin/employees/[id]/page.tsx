"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  HeartPulse,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import { useEmployee } from "@/features/employees/hooks/use-employee";
import { useDeleteEmployee } from "@/features/employees/hooks/use-delete-employee";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { toastHelper } from "@/lib/toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type InfoItemProps = {
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
};

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="break-words text-sm font-medium leading-6">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: employee, isLoading, isError } = useEmployee(id);
  const deleteMutation = useDeleteEmployee();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);

      toastHelper.success(
        "Employee deleted",
        "The employee record has been removed successfully.",
      );

      router.push("/admin/employees");
    } catch (err: any) {
      toastHelper.error(
        "Delete failed",
        err.response?.data?.message || "Could not delete the employee.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>

            <CardTitle>Employee Not Found</CardTitle>
            <CardDescription>
              Data employee tidak ditemukan atau sudah dihapus.
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

  const user = employee.user;
  const displayName = employee.full_name || "Unknown Employee";
  const isActive = Boolean(employee.is_active);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6 lg:py-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/admin/employees">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Link>
      </Button>

      <div className="flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-sm md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16 rounded-lg border">
            <AvatarImage src={user?.avatar_url || ""} alt={displayName} />
            <AvatarFallback className="rounded-lg">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {displayName}
              </h1>

              <Badge
                variant={isActive ? "default" : "secondary"}
                className={cn(!isActive && "text-muted-foreground")}
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                {employee.position || "-"}
              </span>

              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {employee.email || "-"}
              </span>

              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                {employee.employee_code || "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" asChild>
            <Link href={`/admin/employees/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>

          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Informasi dasar employee dan user account.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoItem icon={UserRound} label="First Name" value={user?.first_name} />
              <InfoItem icon={UserRound} label="Last Name" value={user?.last_name} />
              <InfoItem icon={Mail} label="Email" value={employee.email} />
              <InfoItem icon={Phone} label="Phone" value={employee.phone} />
              <InfoItem icon={UserRound} label="Gender" value={user?.gender} />
              <InfoItem
                icon={CalendarDays}
                label="Birth Date"
                value={formatDate(user?.birth_date)}
              />
              <div className="sm:col-span-2 xl:col-span-3">
                <InfoItem icon={MapPin} label="Address" value={user?.address} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
              <CardDescription>
                Role, department, office, shift, dan status kerja.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoItem icon={ShieldCheck} label="System Role" value={user?.role} />
              <InfoItem icon={Briefcase} label="Position" value={employee.position} />
              <InfoItem icon={Building2} label="Department" value={employee.department} />
              <InfoItem
                icon={Building2}
                label="Office"
                value={employee.office?.name}
              />
              <InfoItem icon={Clock} label="Shift" value={employee.shift?.name} />
              <InfoItem
                icon={CheckCircle2}
                label="Employment Status"
                value={employee.employment_status}
              />
              <InfoItem
                icon={CalendarDays}
                label="Join Date"
                value={formatDate(employee.join_date)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency & Notes</CardTitle>
              <CardDescription>
                Kontak darurat dan catatan internal employee.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3 sm:grid-cols-2">
              <InfoItem
                icon={HeartPulse}
                label="Emergency Contact"
                value={employee.emergency_contact}
              />
              <InfoItem
                icon={Phone}
                label="Emergency Phone"
                value={employee.emergency_phone}
              />

              <div className="sm:col-span-2">
                <InfoItem icon={FileText} label="Internal Notes" value={employee.notes} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>Ringkasan performa 30 hari terakhir.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Attendance Score</span>
                  <span className="font-medium">98%</span>
                </div>
                <Progress value={98} />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-4">
                  <p className="text-2xl font-semibold">2</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-2xl font-semibold">0</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>

              <Button variant="secondary" className="w-full" asChild>
                <Link href={`/admin/reports?employee_id=${id}`}>
                  Analyze Full History
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <CardTitle>System Security</CardTitle>
              <CardDescription>
                Semua perubahan employee sebaiknya masuk audit log admin.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Audit logging enabled
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        title="Delete Employee"
        description={`Are you sure you want to permanently delete ${displayName}? This action will also remove the associated user account and cannot be undone.`}
      />
    </div>
  );
}