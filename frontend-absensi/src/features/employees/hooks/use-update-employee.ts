import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { employeeService } from "../services/employee.service";
import { UpdateEmployeePayload } from "../types/employee.type";
import { toastHelper } from "@/lib/toast";
import { useRouter } from "next/navigation";

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEmployeePayload }) =>
      employeeService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employees", id] });
      toastHelper.success("Employee updated", "Employee information has been updated successfully.");
      router.push("/admin/employees");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Update failed", error.response?.data?.message || "Failed to update the employee.");
    },
  });
}
