import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rbacService } from "../services/rbac.service";
import { toast } from "sonner";

export function useSyncPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      rbacService.syncRolePermissions(roleId, permissionIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", variables.roleId] });
      toast.success("Permissions updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update permissions");
    },
  });
}
