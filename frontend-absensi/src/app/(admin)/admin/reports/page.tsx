"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Clock, Download, FileText, Timer, UserCheck, UserX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

function statusVariant(status: string) {
  if (status === "late") return "secondary";
  if (status === "absent") return "destructive";
  if (status === "checked_in") return "outline";
  return "default";
}

export default function ReportsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [officeId, setOfficeId] = useState("all");
  const [employeeId, setEmployeeId] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const reportParams = useMemo(
    () => ({
      page,
      limit: 10,
      status: status === "all" ? undefined : status,
      office_id: officeId === "all" ? undefined : officeId,
      employee_id: employeeId === "all" ? undefined : employeeId,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    }),
    [employeeId, endDate, officeId, page, startDate, status]
  );

  const { data: report, isLoading, isError, error } = useReports(reportParams);
  const { data: offices = [] } = useOffices({ limit: 100 });
  const { data: employees } = useEmployees({ limit: 100 });

  const summary = report?.summary;
  const rows = report?.items ?? [];
  const totalPages = report?.meta.total_pages ?? 1;

  const exportCsv = () => {
    const headers = [
      "Employee Code",
      "Employee Name",
      "Office",
      "Shift",
      "Date",
      "Check In",
      "Check Out",
      "Status",
      "Late Minutes",
    ];
    const csvRows = rows.map((row) =>
      [
        row.employee_code,
        row.employee_name,
        row.office_name,
        row.shift_name,
        row.date,
        row.check_in ?? "",
        row.check_out ?? "",
        row.status,
        String(row.late_minutes),
      ]
        .map((value) => `"${value.replaceAll('"', '""')}"`)
        .join(",")
    );
    const blob = new Blob([[headers.join(","), ...csvRows].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Attendance Report</h1>
        <p className="text-sm text-muted-foreground">
          Real-time attendance report from backend attendance records.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <UserCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary?.total_present ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Timer className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary?.total_late ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <UserX className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary?.total_absent ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{summary?.total_checked_in ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{report?.meta.total ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Attendance Records</CardTitle>
              <Button variant="outline" size="sm" onClick={exportCsv} disabled={rows.length === 0}>
                <Download className="mr-2 size-4" />
                Export CSV
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <Input
                type="date"
                value={startDate}
                onChange={(event) => {
                  setPage(1);
                  setStartDate(event.target.value);
                }}
              />
              <Input
                type="date"
                value={endDate}
                onChange={(event) => {
                  setPage(1);
                  setEndDate(event.target.value);
                }}
              />
              <Select
                value={status}
                onValueChange={(value) => {
                  setPage(1);
                  setStatus(value ?? "all");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="checked_out">Checked Out</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={officeId}
                onValueChange={(value) => {
                  setPage(1);
                  setOfficeId(value ?? "all");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Office" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offices</SelectItem>
                  {offices.map((office) => (
                    <SelectItem key={office.id} value={office.id}>
                      {office.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={employeeId}
                onValueChange={(value) => {
                  setPage(1);
                  setEmployeeId(value ?? "all");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees?.items.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" />
              <span>{error instanceof Error ? error.message : "Failed to load attendance report"}</span>
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
              No attendance records found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Office</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Date</TableHead>
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
                    <TableCell>{row.shift_name}</TableCell>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
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
        <div className="flex items-center justify-between px-6 pb-6">
          <p className="text-xs text-muted-foreground">
            Showing {rows.length} of {report?.meta.total ?? 0} records
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
