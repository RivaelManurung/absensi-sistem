import { useQuery } from "@tanstack/react-query";
import { officeService } from "../services/office.service";

export function useOffice(id: string) {
  return useQuery({
    queryKey: ["offices", id],
    queryFn: () => officeService.getById(id),
    enabled: !!id,
  });
}
