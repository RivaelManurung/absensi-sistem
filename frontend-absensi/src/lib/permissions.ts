import { User } from "@/features/auth/auth.service";

export type Permission = 
  | "auth.login"
  | "auth.logout"
  | "dashboard.read"
  | "employee.read"
  | "employee.create"
  | "employee.update"
  | "employee.delete"
  | "employee.qr.read"
  | "employee.qr.regenerate"
  | "employee.qr.revoke"
  | "office.read"
  | "office.create"
  | "office.update"
  | "office.delete"
  | "shift.read"
  | "shift.create"
  | "shift.update"
  | "shift.delete"
  | "attendance.self.read"
  | "attendance.self.check_in"
  | "attendance.self.check_out"
  | "attendance.history.read"
  | "attendance.admin.read"
  | "attendance.admin.scan_employee_qr"
  | "attendance.admin.override"
  | "attendance.admin.report"
  | "qr.office.generate"
  | "qr.office.revoke"
  | "qr.office.read"
  | "report.read"
  | "report.export"
  | "setting.read"
  | "setting.update"
  | "setting.manage"
  | "user.read"
  | "user.create"
  | "user.update"
  | "user.delete"
  | "role.read"
  | "role.create"
  | "role.update"
  | "role.delete"
  | "permission.read"
  | "permission.assign";

/**
 * Checks if the user has the super_admin role.
 * Handles multiple role formats to be resilient.
 */
export function isSuperAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  
  const superAdminRoles = ["super_admin", "superadmin", "Super Admin", "SUPER_ADMIN"];
  
  // Check primary role field
  if (superAdminRoles.includes(user.role)) return true;
  
  // Also check permissions wildcard if available
  if (user.permissions?.includes("*")) return true;
  
  return false;
}

/**
 * Checks if a user has a specific permission.
 * Super Admin always returns true.
 */
export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  
  if (isSuperAdmin(user)) return true;
  
  if (!user.permissions) return false;
  
  return user.permissions.includes(permission);
}

/**
 * Checks if user has ANY of the provided permissions.
 * Super Admin always returns true.
 */
export function hasAnyPermission(user: User | null | undefined, permissions: Permission[]): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return permissions.some(p => hasPermission(user, p));
}

/**
 * Checks if user has ALL of the provided permissions.
 * Super Admin always returns true.
 */
export function hasAllPermissions(user: User | null | undefined, permissions: Permission[]): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return permissions.every(p => hasPermission(user, p));
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null | undefined, roles: string | string[]): boolean {
  if (!user) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
}
