import { useQuery } from "@tanstack/react-query";
import { officeService } from "../services/office.service";

export function useOffices(params?: any) {
  return useQuery({
    queryKey: ["offices", params],
    queryFn: () => officeService.getAll(params),
  });
}
