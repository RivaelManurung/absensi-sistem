import { useMutation, useQueryClient } from "@tanstack/react-query";
import { officeService } from "../services/office.service";
import { toastHelper } from "@/lib/toast";
import { AxiosError } from "axios";

export function useDeleteOffice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: officeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      toastHelper.success("Office deleted", "The office location has been removed successfully.");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Delete failed", error.response?.data?.message || "Failed to delete the office.");
    },
  });
}
