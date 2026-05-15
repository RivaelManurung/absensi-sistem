import { useQuery } from "@tanstack/react-query";
import { reportService, ReportQueryParams } from "../services/report.service";

export function useReports(params?: ReportQueryParams) {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => reportService.getAll(params),
  });
}
