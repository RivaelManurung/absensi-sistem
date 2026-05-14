import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "../services/report.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCreateReport() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: reportService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report generation started");
      router.push(`/reports/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to generate report");
    },
  });
}
