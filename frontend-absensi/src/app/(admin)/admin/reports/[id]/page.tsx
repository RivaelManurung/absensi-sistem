"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Loader2,
  Search,
  UserCheck,
  UserX,
  Plus,
  Filter,
} from "lucide-react";

import { useOffices } from "@/features/offices/hooks/use-offices";
import { useShifts } from "@/features/shifts/hooks/use-shifts";
import { reportService } from "@/features/reports/services/report.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AttendanceStatus = "all" | "present" | "late" | "absent" | "checked_out";

type AttendanceRecord = {
  id: string;
  employee_name: string;
  employee_code: string;
  office_name: string;
  shift_name: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  late_minutes: number;
};

type AttendanceSummary = {
  present: number;
  late: number;
  absent: number;
  checked_in: number;
  records: number;
};

type AttendanceReportResponse = {
  summary: AttendanceSummary;
  records: AttendanceRecord[];
};

// Options are now handled dynamically in the component using hooks

async function getAttendanceReport(): Promise<AttendanceReportResponse> {
  // TODO: ganti dengan service asli kamu
  // return attendanceReportService.getReport(params);

  return {
    summary: {
      present: 24,
      late: 24,
      absent: 24,
      checked_in: 24,
      records: 120,
    },
    records: [
      {
        id: "1",
        employee_name: "Tiara Febriani",
        employee_code: "EMP030",
        office_name: "Makassar Regional Office",
        shift_name: "Runtime Test Shift",
        date: "14/05/2026",
        check_in: "23.45",
        check_out: "00.04",
        status: "checked out",
        late_minutes: 0,
      },
    ],
  };
}

export default function AttendanceReportPage() {
  const { data: officesData } = useOffices({ limit: 100 });
  const { data: shiftsData } = useShifts();
  
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-01"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [officeId, setOfficeId] = useState("all");
  const [shiftId, setShiftId] = useState("all");
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const reportParams = useMemo(() => ({
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    office_id: officeId === "all" ? undefined : officeId,
    status: status === "all" ? undefined : status,
  }), [startDate, endDate, officeId, status]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["attendance-report-detail", reportParams],
    queryFn: () => reportService.getAll(reportParams),
  });

  const offices = officesData || [];
  const shifts = shiftsData || [];

  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Present", value: "present" },
    { label: "Late", value: "late" },
    { label: "Absent", value: "absent" },
    { label: "Checked In", value: "checked_in" },
    { label: "Checked Out", value: "checked_out" },
  ];

  const records = useMemo(() => {
    if (!data?.items) return [];

    return data.items.filter((record) => {
      const keyword = search.toLowerCase().trim();

      if (!keyword) return true;

      return (
        record.employee_name.toLowerCase().includes(keyword) ||
        record.employee_code.toLowerCase().includes(keyword) ||
        record.office_name.toLowerCase().includes(keyword) ||
        record.shift_name.toLowerCase().includes(keyword)
      );
    });
  }, [data?.items, search]);

  const summaryCards = [
    {
      title: "Present",
      value: data?.summary.total_present ?? 0,
      icon: UserCheck,
      description: "Employees who attended",
    },
    {
      title: "Late",
      value: data?.summary.total_late ?? 0,
      icon: Clock,
      description: "Employees checked in late",
    },
    {
      title: "Absent",
      value: data?.summary.total_absent ?? 0,
      icon: UserX,
      description: "Employees without attendance",
    },
    {
      title: "Checked In",
      value: data?.summary.total_checked_in ?? 0,
      icon: CheckCircle2,
      description: "Currently checked in",
    },
    {
      title: "Records",
      value: data?.meta.total ?? 0,
      icon: FileText,
      description: "Total attendance records",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Attendance Report
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time attendance report from backend attendance records.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="rounded-2xl">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>
              Gunakan filter di bawah untuk mempersempit data berdasarkan
              tanggal, kantor, shift, dan status kehadiran.
            </CardDescription>
          </div>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-2xl border bg-muted/20 p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold">Report Filters</h3>
                <p className="text-sm text-muted-foreground">
                  Pilih filter yang dibutuhkan. Biarkan pilihan tetap “All”
                  jika ingin melihat semua data.
                </p>
              </div>
            </div>

            <Separator className="mb-4" />

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Tanggal awal laporan.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Kosongkan jika hanya ingin melihat satu tanggal.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Office</label>
                <Select value={officeId} onValueChange={(val) => setOfficeId(val || "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select office" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Offices</SelectItem>
                    {offices.map((off) => (
                      <SelectItem key={off.id} value={off.id}>
                        {off.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Filter berdasarkan lokasi kantor.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Shift</label>
                <Select value={shiftId} onValueChange={(val) => setShiftId(val || "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Shifts</SelectItem>
                    {shifts.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Filter berdasarkan jadwal shift.
                </p>
              </div>

              <div className="space-y-2 xl:col-span-2">
                <label className="text-sm font-medium">Attendance Status</label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as AttendanceStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select attendance status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Contoh: Present, Late, Absent, atau Checked Out.
                </p>
              </div>

              <div className="space-y-2 xl:col-span-2">
                <label className="text-sm font-medium">Search Employee</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by employee, code, office, or shift..."
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Cari nama karyawan, kode employee, kantor, atau shift.
                </p>
              </div>
            </div>
          </div>

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load attendance records.
              </AlertDescription>
            </Alert>
          )}

          <div className="overflow-hidden rounded-2xl border">
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading attendance records...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="text-sm text-muted-foreground">
                        No attendance records found for the selected filters.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">
                          {record.employee_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {record.employee_code}
                        </div>
                      </TableCell>
                      <TableCell>{record.office_name}</TableCell>
                      <TableCell>{record.shift_name}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.check_in ?? "-"}</TableCell>
                      <TableCell>{record.check_out ?? "-"}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(record.status)} className="capitalize">
                          {record.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {record.late_minutes}m
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function statusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "present":
    case "checked_in":
    case "checked_out":
      return "secondary";
    case "late":
      return "outline";
    case "absent":
      return "destructive";
    default:
      return "outline";
  }
}