export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  HR = 'hr',
  MANAGER = 'manager',
  SECURITY = 'security',
  EMPLOYEE = 'employee',
}

export const Permissions = {
  // Auth
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',

  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',

  // Employees
  EMPLOYEES_VIEW: 'employees.view',
  EMPLOYEES_CREATE: 'employees.create',
  EMPLOYEES_UPDATE: 'employees.update',
  EMPLOYEES_DELETE: 'employees.delete',
  EMPLOYEES_QR_VIEW: 'employees.qr.view',
  EMPLOYEES_QR_REGENERATE: 'employees.qr.regenerate',
  EMPLOYEES_QR_REVOKE: 'employees.qr.revoke',

  // Offices
  OFFICES_VIEW: 'offices.view',
  OFFICES_CREATE: 'offices.create',
  OFFICES_UPDATE: 'offices.update',
  OFFICES_DELETE: 'offices.delete',

  // Shifts
  SHIFTS_VIEW: 'shifts.view',
  SHIFTS_CREATE: 'shifts.create',
  SHIFTS_UPDATE: 'shifts.update',
  SHIFTS_DELETE: 'shifts.delete',

  // Attendance Self
  ATTENDANCE_SELF_VIEW: 'attendance.self.view',
  ATTENDANCE_SELF_CHECK_IN: 'attendance.self.check_in',
  ATTENDANCE_SELF_CHECK_OUT: 'attendance.self.check_out',
  ATTENDANCE_HISTORY_VIEW: 'attendance.history.view',

  // Attendance Admin
  ATTENDANCE_ADMIN_VIEW: 'attendance.admin.view',
  ATTENDANCE_ADMIN_SCAN: 'attendance.admin.scan_employee_qr',
  ATTENDANCE_ADMIN_OVERRIDE: 'attendance.admin.override',
  ATTENDANCE_ADMIN_REPORT: 'attendance.admin.report',

  // QR Office
  QR_OFFICE_GENERATE: 'qr.office.generate',
  QR_OFFICE_REVOKE: 'qr.office.revoke',
  QR_OFFICE_VIEW: 'qr.office.view',

  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',

  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_UPDATE: 'settings.update',
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];
