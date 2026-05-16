import { Permission } from "@/lib/permissions";

export interface PermissionItem {
  id: string;
  name: Permission;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  user_count: number;
  permissions: string[];
}

export interface SyncPermissionsRequest {
  permission_ids: string[];
}
