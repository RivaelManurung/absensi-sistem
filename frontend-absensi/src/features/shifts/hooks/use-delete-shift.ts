import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useDeleteShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shiftService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success("Shift deleted successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to delete shift");
    },
  });
}
