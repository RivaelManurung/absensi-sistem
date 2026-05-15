import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  attendanceService,
  LocationPayload,
} from "./services/attendance.service";
import { toast } from "sonner";

export const useAttendanceToday = () => {
  return useQuery({
    queryKey: ["attendance", "today"],
    queryFn: () => attendanceService.getToday(),
    retry: false,
  });
};

export const useAttendanceHistory = () => {
  return useQuery({
    queryKey: ["attendance", "history"],
    queryFn: () => attendanceService.getHistory(),
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LocationPayload) => attendanceService.checkIn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-history"] });
      toast.success("Checked in successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to check in");
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LocationPayload) => attendanceService.checkOut(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-history"] });
      toast.success("Checked out successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to check out");
    },
  });
};
