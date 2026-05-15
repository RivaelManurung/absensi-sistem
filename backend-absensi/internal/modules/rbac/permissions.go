package rbac

const (
	// Auth
	PermissionAuthLogin  = "auth.login"
	PermissionAuthLogout = "auth.logout"

	// Dashboard
	PermissionDashboardView = "dashboard.view"

	// Employees
	PermissionEmployeesView       = "employees.view"
	PermissionEmployeesCreate     = "employees.create"
	PermissionEmployeesUpdate     = "employees.update"
	PermissionEmployeesDelete     = "employees.delete"
	PermissionEmployeesQRView     = "employees.qr.view"
	PermissionEmployeesQRRegen    = "employees.qr.regenerate"
	PermissionEmployeesQRRevoke   = "employees.qr.revoke"

	// Offices
	PermissionOfficesView   = "offices.view"
	PermissionOfficesCreate = "offices.create"
	PermissionOfficesUpdate = "offices.update"
	PermissionOfficesDelete = "offices.delete"

	// Shifts
	PermissionShiftsView   = "shifts.view"
	PermissionShiftsCreate = "shifts.create"
	PermissionShiftsUpdate = "shifts.update"
	PermissionShiftsDelete = "shifts.delete"

	// Attendance Self
	PermissionAttendanceSelfView     = "attendance.self.view"
	PermissionAttendanceSelfCheckIn  = "attendance.self.check_in"
	PermissionAttendanceSelfCheckOut = "attendance.self.check_out"
	PermissionAttendanceHistoryView  = "attendance.history.view"

	// Attendance Admin
	PermissionAttendanceAdminView     = "attendance.admin.view"
	PermissionAttendanceAdminScan     = "attendance.admin.scan_employee_qr"
	PermissionAttendanceAdminOverride = "attendance.admin.override"
	PermissionAttendanceAdminReport   = "attendance.admin.report"

	// QR Office
	PermissionQROfficeGenerate = "qr.office.generate"
	PermissionQROfficeRevoke   = "qr.office.revoke"
	PermissionQROfficeView     = "qr.office.view"

	// Reports
	PermissionReportsView   = "reports.view"
	PermissionReportsExport = "reports.export"

	// Settings
	PermissionSettingsView   = "settings.view"
	PermissionSettingsUpdate = "settings.update"
)
