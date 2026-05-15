import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { toastHelper } from "@/lib/toast";
import { AxiosError } from "axios";

export function useDeleteShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shiftService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toastHelper.success("Shift deleted", "The shift schedule has been removed successfully.");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Delete failed", error.response?.data?.message || "Failed to delete the shift.");
    },
  });
}
