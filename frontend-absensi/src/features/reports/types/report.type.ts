export type AttendanceReportStatus =
  | "present"
  | "late"
  | "absent"
  | "checked_in"
  | "checked_out";

export interface AttendanceReportRow {
  id: string;
  employee_name: string;
  employee_code: string;
  office_name: string;
  shift_name: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: AttendanceReportStatus | string;
  late_minutes: number;
}

export interface AttendanceReportSummary {
  total_present: number;
  total_late: number;
  total_absent: number;
  total_checked_in: number;
  total_checked_out: number;
}

export interface AttendanceReport {
  items: AttendanceReportRow[];
  summary: AttendanceReportSummary;
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export type ReportType = "Daily" | "Monthly" | "Late" | "Summary";
export type ReportFormat = "PDF" | "XLSX" | "CSV";

export interface CreateReportPayload {
  type: ReportType;
  date_range: {
    from: string;
    to: string;
  };
  office_id?: string;
  format: ReportFormat;
}

export interface GeneratedReport {
  id: string;
  title: string;
  type: ReportType;
  format: ReportFormat;
  status: "Processing" | "Completed" | "Failed";
  date_range: {
    from: string;
    to: string;
  };
  created_at: string;
  file_url?: string;
}
