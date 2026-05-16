import { apiClient } from "@/lib/api/api-client";
import {
  AttendanceReport,
  AttendanceReportRow,
  AttendanceReportSummary,
  CreateReportPayload,
  GeneratedReport,
} from "../types/report.type";

type BackendAttendance = {
  id: string;
  attendance_date: string;
  check_in_at: string | null;
  check_out_at: string | null;
  status: string;
  late_minutes: number;
  employee?: {
    employee_code: string;
    full_name: string;
    office?: {
      name: string;
    };
    shift?: {
      name: string;
    };
  };
};

type BackendReportResponse = {
  success: boolean;
  message: string;
  data: {
    report: {
      items: BackendAttendance[];
      meta: AttendanceReport["meta"];
    };
    summary: AttendanceReportSummary;
  };
};

export type ReportQueryParams = {
  page?: number;
  limit?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  employee_id?: string;
  office_id?: string;
};

import { format } from "date-fns";

function formatDateTime(value: string | null) {
  if (!value) return null;
  return format(new Date(value), "HH:mm");
}

function mapRow(row: BackendAttendance): AttendanceReportRow {
  return {
    id: row.id,
    employee_name: row.employee?.full_name ?? "Employee",
    employee_code: row.employee?.employee_code ?? "-",
    office_name: row.employee?.office?.name ?? "-",
    shift_name: row.employee?.shift?.name ?? "-",
    date: row.attendance_date,
    check_in: formatDateTime(row.check_in_at),
    check_out: formatDateTime(row.check_out_at),
    status: row.status,
    late_minutes: row.late_minutes,
  };
}

export const reportService = {
  getAll: async (params?: ReportQueryParams) => {
    const response = await apiClient.get<BackendReportResponse>(
      "/admin/attendance/report",
      { params }
    );

    return {
      items: response.data.data.report.items.map(mapRow),
      meta: response.data.data.report.meta,
      summary: response.data.data.summary,
    };
  },
  create: async (payload: CreateReportPayload) => {
    const params = {
      start_date: payload.date_range.from,
      end_date: payload.date_range.to,
      office_id: payload.office_id,
    };
    const report = await reportService.getAll(params);

    return {
      id: `attendance-report-${params.start_date}-${params.end_date}`,
      ...report,
    };
  },
  getById: async (id: string): Promise<GeneratedReport> => {
    await reportService.getAll({ limit: 1 });

    return {
      id,
      title: "Attendance Report",
      type: "Summary",
      format: "CSV",
      status: "Completed",
      date_range: {
        from: new Date().toISOString().split("T")[0],
        to: new Date().toISOString().split("T")[0],
      },
      created_at: new Date().toISOString(),
    };
  },
};
