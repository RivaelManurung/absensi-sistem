import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { employeeService } from "../services/employee.service";
import { toastHelper } from "@/lib/toast";

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toastHelper.success("Employee deleted", "The employee record has been removed successfully.");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Delete failed", error.response?.data?.message || "Failed to delete the employee.");
    },
  });
}
