import { useQuery } from "@tanstack/react-query";
import { reportService } from "../services/report.service";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: () => reportService.getAll(),
  });
}
