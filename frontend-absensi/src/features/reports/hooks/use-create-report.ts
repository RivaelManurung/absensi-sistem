import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "../services/report.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export function useCreateReport() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: reportService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success(`Loaded ${data.meta.total} attendance records`);
      router.push("/admin/reports");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to generate report");
    },
  });
}
