import { useQuery } from "@tanstack/react-query";
import { rbacService } from "../services/rbac.service";

export function useRole(id: string) {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () => rbacService.getRole(id),
    enabled: !!id,
  });
}
