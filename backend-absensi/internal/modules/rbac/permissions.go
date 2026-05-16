package rbac

const (
	// Auth
	PermissionAuthLogin  = "auth.login"
	PermissionAuthLogout = "auth.logout"

	// Dashboard
	PermissionDashboardRead = "dashboard.read"

	// Employees
	PermissionEmployeesRead      = "employee.read"
	PermissionEmployeesCreate    = "employee.create"
	PermissionEmployeesUpdate    = "employee.update"
	PermissionEmployeesDelete    = "employee.delete"
	PermissionEmployeesQRRead    = "employee.qr.read"
	PermissionEmployeesQRRegen   = "employee.qr.regenerate"
	PermissionEmployeesQRRevoke  = "employee.qr.revoke"

	// Offices
	PermissionOfficesRead   = "office.read"
	PermissionOfficesCreate = "office.create"
	PermissionOfficesUpdate = "office.update"
	PermissionOfficesDelete = "office.delete"

	// Shifts
	PermissionShiftsRead   = "shift.read"
	PermissionShiftsCreate = "shift.create"
	PermissionShiftsUpdate = "shift.update"
	PermissionShiftsDelete = "shift.delete"

	// Attendance Self
	PermissionAttendanceSelfRead     = "attendance.self.read"
	PermissionAttendanceSelfCheckIn  = "attendance.self.check_in"
	PermissionAttendanceSelfCheckOut = "attendance.self.check_out"
	PermissionAttendanceHistoryRead  = "attendance.history.read"

	// Attendance Admin
	PermissionAttendanceAdminRead     = "attendance.admin.read"
	PermissionAttendanceAdminScan     = "attendance.admin.scan_employee_qr"
	PermissionAttendanceAdminOverride = "attendance.admin.override"
	PermissionAttendanceAdminReport   = "attendance.admin.report"

	// QR Office
	PermissionQROfficeGenerate = "qr.office.generate"
	PermissionQROfficeRevoke   = "qr.office.revoke"
	PermissionQROfficeRead     = "qr.office.read"

	// Reports
	PermissionReportsRead   = "report.read"
	PermissionReportsExport = "report.export"

	// Settings
	PermissionSettingsRead   = "setting.read"
	PermissionSettingsUpdate = "setting.update"
	PermissionSettingsManage = "setting.manage"

	// Users
	PermissionUsersRead   = "user.read"
	PermissionUsersCreate = "user.create"
	PermissionUsersUpdate = "user.update"
	PermissionUsersDelete = "user.delete"

	// Roles
	PermissionRolesRead   = "role.read"
	PermissionRolesCreate = "role.create"
	PermissionRolesUpdate = "role.update"
	PermissionRolesDelete = "role.delete"

	// Permissions
	PermissionPermissionsRead   = "permission.read"
	PermissionPermissionsAssign = "permission.assign"
)
