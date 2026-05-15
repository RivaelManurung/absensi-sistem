import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  attendanceService,
  LocationPayload,
} from "./services/attendance.service";
import { toastHelper } from "@/lib/toast";

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
      toastHelper.success("Check-in successful", "Your attendance has been recorded.");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Check-in failed", error.response?.data?.message || "Failed to record your check-in.");
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
      toastHelper.success("Check-out successful", "Thank you for your hard work today!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Check-out failed", error.response?.data?.message || "Failed to record your check-out.");
    },
  });
};
