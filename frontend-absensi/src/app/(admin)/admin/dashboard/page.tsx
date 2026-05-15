"use client";

import Link from "next/link";
import { CalendarCheck, Clock, FileText, MapPin, UserMinus, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { useOffices } from "@/features/offices/hooks/use-offices";
import { useReports } from "@/features/reports/hooks/use-reports";
import { useShifts } from "@/features/shifts/hooks/use-shifts";

function statusVariant(status: string) {
  if (status === "late") return "secondary";
  if (status === "absent") return "destructive";
  if (status === "checked_in") return "outline";
  return "default";
}

export default function DashboardPage() {
  const today = new Date().toISOString().split("T")[0];
  const { data: employees, isLoading: isLoadingEmployees } = useEmployees({ limit: 1 });
  const { data: offices = [], isLoading: isLoadingOffices } = useOffices({ limit: 100 });
  const { data: shifts = [], isLoading: isLoadingShifts } = useShifts({ limit: 100 });
  const { data: report, isLoading: isLoadingReport } = useReports({
    start_date: today,
    end_date: today,
    limit: 8,
  });

  const summary = report?.summary;
  const totalEmployees = employees?.meta.total ?? 0;
  const totalPresent =
    (summary?.total_present ?? 0) +
    (summary?.total_late ?? 0) +
    (summary?.total_checked_in ?? 0) +
    (summary?.total_checked_out ?? 0);
  const totalAbsent = Math.max(totalEmployees - totalPresent, summary?.total_absent ?? 0);

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      description: "Active and inactive employees from backend",
    },
    {
      title: "Present Today",
      value: totalPresent,
      icon: CalendarCheck,
      description: "Present, late, checked in, or checked out today",
    },
    {
      title: "Late Today",
      value: summary?.total_late ?? 0,
      icon: Clock,
      description: "Late records from today's attendance report",
    },
    {
      title: "Absent Today",
      value: totalAbsent,
      icon: UserMinus,
      description: "Computed from employee count and today's attendance",
    },
    {
      title: "Offices / Shifts",
      value: `${offices.length}/${shifts.length}`,
      icon: MapPin,
      description: "Registered offices and shifts",
    },
  ];

  const isLoadingStats = isLoadingEmployees || isLoadingOffices || isLoadingShifts || isLoadingReport;
  const rows = report?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Live overview from backend employees, offices, shifts, and attendance report.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/reports" className={buttonVariants({ variant: "outline", size: "sm" })}>
              <FileText className="mr-2 size-4" />
              Reports
          </Link>
          <Link href="/admin/employees/create" className={buttonVariants({ size: "sm" })}>
            Add Employee
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="pt-1 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Attendance</CardTitle>
          <CardDescription>
            Latest attendance records for {new Date(today).toLocaleDateString()}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingReport ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
              No attendance records for today.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Office</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Late</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="font-medium">{row.employee_name}</div>
                      <div className="text-xs text-muted-foreground">{row.employee_code}</div>
                    </TableCell>
                    <TableCell>{row.office_name}</TableCell>
                    <TableCell>{row.check_in ?? "-"}</TableCell>
                    <TableCell>{row.check_out ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(row.status)}>{row.status.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{row.late_minutes}m</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
