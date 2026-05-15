import { useMutation, useQueryClient } from "@tanstack/react-query";
import { officeService } from "../services/office.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { UpdateOfficePayload } from "../types/office.type";

export function useUpdateOffice() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOfficePayload }) => 
      officeService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      queryClient.invalidateQueries({ queryKey: ["offices", id] });
      toast.success("Office updated successfully");
      router.push("/admin/offices");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to update office");
    },
  });
}
