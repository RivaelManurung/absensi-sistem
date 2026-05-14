import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "../services/attendance.service";

export function useAttendanceDetail(id: string) {
  return useQuery({
    queryKey: ["attendance-record", id],
    queryFn: () => attendanceService.getById(id),
    enabled: !!id,
  });
}
