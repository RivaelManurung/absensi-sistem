import { useQuery } from "@tanstack/react-query";
import { officeService, OfficeQueryParams } from "../services/office.service";

export function useOffices(params?: OfficeQueryParams) {
  return useQuery({
    queryKey: ["offices", params],
    queryFn: () => officeService.getAll(params),
  });
}
