import { useQuery } from "@tanstack/react-query";
import { rbacService } from "../services/rbac.service";

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => rbacService.getPermissions(),
  });
}
