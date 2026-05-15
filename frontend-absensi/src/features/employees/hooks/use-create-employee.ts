import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { employeeService } from "../services/employee.service";
import { toastHelper } from "@/lib/toast";
import { useRouter } from "next/navigation";

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toastHelper.success("Employee created", "A new employee record has been added successfully.");
      router.push("/admin/employees");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Create failed", error.response?.data?.message || "Failed to create the employee.");
    },
  });
}
