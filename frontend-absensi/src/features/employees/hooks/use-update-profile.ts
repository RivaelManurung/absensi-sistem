import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { employeeService } from "../services/employee.service";
import { ProfileUpdatePayload } from "../types/employee.type";
import { toastHelper } from "@/lib/toast";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) =>
      employeeService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toastHelper.success("Profile updated", "Your profile has been updated successfully.");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Update failed", error.response?.data?.message || "Failed to update your profile.");
    },
  });
}
