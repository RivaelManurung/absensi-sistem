import { useMutation, useQueryClient } from "@tanstack/react-query";
import { officeService } from "../services/office.service";
import { toast } from "sonner";

export function useDeleteOffice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: officeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      toast.success("Office deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete office");
    },
  });
}
