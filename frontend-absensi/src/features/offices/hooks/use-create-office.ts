import { useMutation, useQueryClient } from "@tanstack/react-query";
import { officeService } from "../services/office.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export function useCreateOffice() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: officeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      toast.success("Office created successfully");
      router.push("/admin/offices");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to create office");
    },
  });
}
