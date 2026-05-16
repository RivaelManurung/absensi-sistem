import apiClient from "@/lib/api-client";
import { Role, PermissionItem, SyncPermissionsRequest } from "../types/rbac.type";

const RBAC_ENDPOINT = "/admin";

export const rbacService = {
  getRoles: async () => {
    const { data } = await apiClient.get(`${RBAC_ENDPOINT}/roles`);
    return data.data as Role[];
  },

  getRole: async (id: string) => {
    const { data } = await apiClient.get(`${RBAC_ENDPOINT}/roles/${id}`);
    return data.data as Role;
  },

  getPermissions: async () => {
    const { data } = await apiClient.get(`${RBAC_ENDPOINT}/permissions`);
    return data.data as PermissionItem[];
  },

  syncRolePermissions: async (roleId: string, permissionIds: string[]) => {
    const payload: SyncPermissionsRequest = {
      permission_ids: permissionIds,
    };
    const { data } = await apiClient.put(
      `${RBAC_ENDPOINT}/roles/${roleId}/permissions`,
      payload
    );
    return data;
  },
};
