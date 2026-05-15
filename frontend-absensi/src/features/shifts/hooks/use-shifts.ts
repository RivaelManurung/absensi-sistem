import { useQuery } from "@tanstack/react-query";
import { shiftService, ShiftQueryParams } from "../services/shift.service";

export function useShifts(params?: ShiftQueryParams) {
  return useQuery({
    queryKey: ["shifts", params],
    queryFn: () => shiftService.getAll(params),
  });
}
