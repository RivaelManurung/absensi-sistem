import { useMutation, useQueryClient } from "@tanstack/react-query";
import { officeService } from "../services/office.service";
import { toastHelper } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export function useCreateOffice() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: officeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      toastHelper.success("Office created", "The new office location has been added successfully.");
      router.push("/admin/offices");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toastHelper.error("Create failed", error.response?.data?.message || "Failed to create the office.");
    },
  });
}
