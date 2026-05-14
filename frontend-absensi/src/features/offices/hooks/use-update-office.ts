import { useMutation, useQueryClient } from "@tanstack/react-query";
import { officeService } from "../services/office.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useUpdateOffice() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      officeService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["offices"] });
      queryClient.invalidateQueries({ queryKey: ["offices", id] });
      toast.success("Office updated successfully");
      router.push("/offices");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update office");
    },
  });
}
