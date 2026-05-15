import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "../services/attendance.service";

export function useAttendanceHistory(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ["attendance-history", params],
    queryFn: () => attendanceService.getHistory(params),
  });
}
