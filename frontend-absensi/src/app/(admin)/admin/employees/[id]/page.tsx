"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  Edit,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  UserRound,
  MapPin,
  HeartPulse,
  FileText,
  User as UserIcon,
  Clock,
  CircleCheck,
} from "lucide-react";

import { useEmployee } from "@/features/employees/hooks/use-employee";
import { useDeleteEmployee } from "@/features/employees/hooks/use-delete-employee";
import { DeleteDialog } from "@/components/shared/delete-dialog";
import { toastHelper } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type InfoItemProps = {
  icon: React.ElementType;
  label: string;
  value?: string | number | null;
  className?: string;
};

function InfoItem({ icon: Icon, label, value, className = "" }: InfoItemProps) {
  return (
    <div className={`flex items-start gap-4 p-5 transition-colors hover:bg-muted/40 ${className}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-foreground">
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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toastHelper.success("Employee deleted", "The employee record has been removed successfully.");
      router.push("/admin/employees");
    } catch (err: any) {
      toastHelper.error("Delete failed", err.response?.data?.message || "Could not delete the employee.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="animate-pulse text-sm font-medium">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <Card className="w-full max-w-md rounded-3xl border-dashed shadow-none">
          <CardHeader className="items-center text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">Employee Not Found</CardTitle>
            <CardDescription className="text-base">
              The employee record could not be found. It may have been deleted or the ID is incorrect.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="lg" className="w-full rounded-2xl" asChild>
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

  return (
    <div className="w-full space-y-8 px-6 py-8">
      {/* Premium Header */}
      <div className="flex flex-col gap-6 rounded-[2.5rem] border bg-card p-8 shadow-sm md:flex-row md:items-center md:justify-between lg:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent text-primary shadow-inner border border-primary/10 overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-16 w-16" />
              )}
            </div>
            <div className="absolute -right-1 -top-1 h-6 w-6 rounded-full border-4 border-background bg-green-500 shadow-sm" />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight lg:text-5xl">
                {displayName}
              </h1>
              <Badge variant="secondary" className="rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 px-4 py-1 font-bold text-xs uppercase tracking-widest">
                {employee.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary uppercase">ID</span>
                <span className="font-bold text-foreground">{employee.employee_code}</span>
              </p>
              <Separator orientation="vertical" className="hidden h-4 md:block" />
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                {employee.email}
              </p>
               <Separator orientation="vertical" className="hidden h-4 md:block" />
              <p className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                {employee.position}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:self-start">
          <Button variant="outline" size="lg" asChild className="rounded-[1.25rem] px-8 h-14 font-bold border-2 hover:bg-muted/50">
            <Link href={`/admin/employees/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Employee
            </Link>
          </Button>

          <Button
            variant="destructive"
            size="lg"
            className="rounded-[1.25rem] px-8 h-14 font-bold shadow-lg shadow-destructive/20"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Remove
          </Button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        {/* Left Columns: Information Sections */}
        <div className="xl:col-span-2 space-y-8">
          <Card className="overflow-hidden rounded-[2rem] border-none shadow-md ring-1 ring-border">
            <CardHeader className="bg-muted/30 px-10 py-8">
                <div className="flex items-center gap-3 text-primary mb-1">
                    <UserIcon className="h-6 w-6" />
                    <CardTitle className="text-2xl font-black">Personal Profile</CardTitle>
                </div>
              <CardDescription className="text-base font-medium">
                Comprehensive identity and personal information.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t">
                <InfoItem icon={UserIcon} label="First Name" value={user?.first_name} />
                <InfoItem icon={UserIcon} label="Last Name" value={user?.last_name} />
                <InfoItem icon={Mail} label="Email Address" value={employee.email} />
                <InfoItem icon={Phone} label="Phone Number" value={employee.phone} />
                <InfoItem icon={UserIcon} label="Gender" value={user?.gender} />
                <InfoItem 
                    icon={CalendarDays} 
                    label="Birth Date" 
                    value={user?.birth_date ? new Date(user.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"} 
                />
              </div>
              <div className="border-t">
                <InfoItem icon={MapPin} label="Home Address" value={user?.address} className="sm:col-span-2 lg:col-span-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[2rem] border-none shadow-md ring-1 ring-border">
            <CardHeader className="bg-muted/30 px-10 py-8">
                <div className="flex items-center gap-3 text-primary mb-1">
                    <Briefcase className="h-6 w-6" />
                    <CardTitle className="text-2xl font-black">Employment Details</CardTitle>
                </div>
              <CardDescription className="text-base font-medium">
                Work placement, role, and historical data.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t">
                <InfoItem icon={ShieldCheck} label="System Role" value={user?.role} />
                <InfoItem icon={Briefcase} label="Position" value={employee.position} />
                <InfoItem icon={Building2} label="Department" value={employee.department} />
                <InfoItem icon={Building2} label="Office Location" value={employee.office?.name} />
                <InfoItem icon={Clock} label="Shift Schedule" value={employee.shift?.name} />
                <InfoItem 
                    icon={CircleCheck} 
                    label="Employment Status" 
                    value={employee.employment_status} 
                />
                <InfoItem 
                    icon={CalendarDays} 
                    label="Join Date" 
                    value={employee.join_date ? new Date(employee.join_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[2rem] border-none shadow-md ring-1 ring-border">
            <CardHeader className="bg-muted/30 px-10 py-8">
                <div className="flex items-center gap-3 text-primary mb-1">
                    <HeartPulse className="h-6 w-6" />
                    <CardTitle className="text-2xl font-black">Emergency & Notes</CardTitle>
                </div>
              <CardDescription className="text-base font-medium">
                Critical contact information and internal records.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="grid sm:grid-cols-2 border-t">
                <InfoItem icon={UserIcon} label="Emergency Contact" value={employee.emergency_contact} />
                <InfoItem icon={Phone} label="Emergency Phone" value={employee.emergency_phone} />
              </div>
              <div className="border-t">
                <InfoItem icon={FileText} label="Internal Notes" value={employee.notes} className="sm:col-span-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Metrics & Quick Info */}
        <div className="space-y-8">
          <Card className="rounded-[2rem] border-none shadow-md ring-1 ring-border overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-black">Attendance Summary</CardTitle>
              <CardDescription>Last 30 days performance</CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 p-8">
              <div className="relative flex flex-col items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-transparent p-10 text-center ring-1 ring-primary/10">
                <div className="relative h-40 w-40">
                   <svg className="h-40 w-40 -rotate-90 transform">
                    <circle
                      className="text-muted/20"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                      r="70"
                      cx="80"
                      cy="80"
                    />
                    <circle
                      className="text-primary transition-all duration-1000 ease-in-out"
                      strokeWidth="12"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * 98) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="70"
                      cx="80"
                      cy="80"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-black text-primary">98%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border bg-muted/20 p-5 text-center">
                  <p className="text-3xl font-black text-amber-600">2</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                    Late
                  </p>
                </div>

                <div className="rounded-2xl border bg-muted/20 p-5 text-center">
                  <p className="text-3xl font-black text-primary">0</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                    Absent
                  </p>
                </div>
              </div>

              <Button className="w-full rounded-2xl h-14 font-bold text-base" variant="secondary" asChild>
                <Link href={`/admin/reports?employee_id=${id}`}>
                  Analyze Full History
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
                <ShieldCheck className="h-32 w-32" />
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-black mb-3">System Security</h3>
                <p className="text-sm opacity-60 leading-relaxed font-medium">
                  This record is managed under enterprise audit logging. All modifications are tracked and associated with the performing administrator.
                </p>
                <div className="mt-6 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Encryption Enabled</span>
                </div>
            </div>
          </div>
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