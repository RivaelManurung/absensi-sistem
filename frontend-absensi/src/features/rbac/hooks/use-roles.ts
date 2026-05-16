import { useQuery } from "@tanstack/react-query";
import { rbacService } from "../services/rbac.service";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => rbacService.getRoles(),
  });
}
