import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { toastHelper } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export function useUpdateShift() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      shiftService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["shifts", id] });
      toastHelper.success("Shift updated", "The shift information has been updated successfully.");
      router.push("/admin/shifts");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Update failed", error.response?.data?.message || "Failed to update the shift.");
    },
  });
}
