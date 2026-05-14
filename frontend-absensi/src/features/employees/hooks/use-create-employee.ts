import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "../services/employee.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created successfully");
      router.push("/employees");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create employee");
    },
  });
}
