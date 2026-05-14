import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "../services/attendance.service";

export function useAttendanceHistory(params?: any) {
  return useQuery({
    queryKey: ["attendance-history", params],
    queryFn: () => attendanceService.getHistory(params),
  });
}
