import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export function useCreateShift() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: shiftService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success("Shift created successfully");
      router.push("/admin/shifts");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to create shift");
    },
  });
}
