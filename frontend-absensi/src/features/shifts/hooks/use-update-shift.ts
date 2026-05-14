import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useUpdateShift() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      shiftService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["shifts", id] });
      toast.success("Shift updated successfully");
      router.push("/shifts");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update shift");
    },
  });
}
