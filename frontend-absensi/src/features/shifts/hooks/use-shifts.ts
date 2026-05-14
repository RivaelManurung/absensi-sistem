import { useQuery } from "@tanstack/react-query";
import { shiftService } from "../services/shift.service";

export function useShifts(params?: any) {
  return useQuery({
    queryKey: ["shifts", params],
    queryFn: () => shiftService.getAll(params),
  });
}
