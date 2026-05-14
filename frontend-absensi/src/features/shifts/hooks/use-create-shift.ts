import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCreateShift() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: shiftService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success("Shift created successfully");
      router.push("/shifts");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create shift");
    },
  });
}
