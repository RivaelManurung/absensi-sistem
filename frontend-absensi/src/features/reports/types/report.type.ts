export type ReportType = "Daily" | "Monthly" | "Late" | "Summary";
export type ReportFormat = "PDF" | "XLSX" | "CSV";
export type ReportStatus = "Processing" | "Completed" | "Failed";

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  format: ReportFormat;
  status: ReportStatus;
  office_id?: string;
  employee_id?: string;
  date_range: {
    from: string;
    to: string;
  };
  file_url?: string;
  created_at: string;
  last_generated?: string;
}

export interface CreateReportPayload {
  type: ReportType;
  date_range: {
    from: string;
    to: string;
  };
  office_id?: string;
  employee_id?: string;
  format: ReportFormat;
}
