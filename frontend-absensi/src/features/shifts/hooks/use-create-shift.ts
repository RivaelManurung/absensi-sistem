import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { toastHelper } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export function useCreateShift() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: shiftService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toastHelper.success("Shift created", "The new shift schedule has been added successfully.");
      router.push("/admin/shifts");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Create failed", error.response?.data?.message || "Failed to create the shift.");
    },
  });
}
