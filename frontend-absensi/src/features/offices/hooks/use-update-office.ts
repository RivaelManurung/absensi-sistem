import { useMutation, useQueryClient } from "@tanstack/react-query";
import { officeService } from "../services/office.service";
import { toastHelper } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export function useUpdateOffice() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      officeService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      queryClient.invalidateQueries({ queryKey: ["offices", id] });
      toastHelper.success("Office updated", "The office information has been updated successfully.");
      router.push("/admin/offices");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Update failed", error.response?.data?.message || "Failed to update the office.");
    },
  });
}
