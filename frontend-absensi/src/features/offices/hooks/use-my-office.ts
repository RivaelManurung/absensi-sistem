import { useQuery } from "@tanstack/react-query";
import { officeService } from "../services/office.service";

export function useMyOffice() {
  return useQuery({
    queryKey: ["offices", "me"],
    queryFn: () => officeService.getMyOffice(),
  });
}
