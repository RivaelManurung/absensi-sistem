import { useQuery } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";

export function useShift(id: string) {
  return useQuery({
    queryKey: ["shifts", id],
    queryFn: () => shiftService.getById(id),
    enabled: !!id,
  });
}
