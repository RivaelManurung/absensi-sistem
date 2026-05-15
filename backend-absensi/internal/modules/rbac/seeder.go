package rbac

import (
	"backend-absensi/internal/models"
	"fmt"

	"gorm.io/gorm"
)

func SeedPermissions(db *gorm.DB) error {
	permissions := []models.Permission{
		{Name: PermissionAuthLogin, Description: "Allow user to login"},
		{Name: PermissionAuthLogout, Description: "Allow user to logout"},
		{Name: PermissionDashboardView, Description: "Allow user to view dashboard"},
		
		{Name: PermissionEmployeesView, Description: "Allow user to view employee list"},
		{Name: PermissionEmployeesCreate, Description: "Allow user to create new employee"},
		{Name: PermissionEmployeesUpdate, Description: "Allow user to update employee"},
		{Name: PermissionEmployeesDelete, Description: "Allow user to delete employee"},
		{Name: PermissionEmployeesQRView, Description: "Allow user to view employee QR"},
		{Name: PermissionEmployeesQRRegen, Description: "Allow user to regenerate employee QR"},
		{Name: PermissionEmployeesQRRevoke, Description: "Allow user to revoke employee QR"},

		{Name: PermissionOfficesView, Description: "Allow user to view offices"},
		{Name: PermissionOfficesCreate, Description: "Allow user to create office"},
		{Name: PermissionOfficesUpdate, Description: "Allow user to update office"},
		{Name: PermissionOfficesDelete, Description: "Allow user to delete office"},

		{Name: PermissionShiftsView, Description: "Allow user to view shifts"},
		{Name: PermissionShiftsCreate, Description: "Allow user to create shift"},
		{Name: PermissionShiftsUpdate, Description: "Allow user to update shift"},
		{Name: PermissionShiftsDelete, Description: "Allow user to delete shift"},

		{Name: PermissionAttendanceSelfView, Description: "Allow user to view own attendance"},
		{Name: PermissionAttendanceSelfCheckIn, Description: "Allow user to self check-in"},
		{Name: PermissionAttendanceSelfCheckOut, Description: "Allow user to self check-out"},
		{Name: PermissionAttendanceHistoryView, Description: "Allow user to view attendance history"},

		{Name: PermissionAttendanceAdminView, Description: "Allow admin to view all attendance"},
		{Name: PermissionAttendanceAdminScan, Description: "Allow admin/security to scan employee QR"},
		{Name: PermissionAttendanceAdminOverride, Description: "Allow admin to override attendance"},
		{Name: PermissionAttendanceAdminReport, Description: "Allow admin to view attendance reports"},

		{Name: PermissionQROfficeGenerate, Description: "Allow admin to generate office dynamic QR"},
		{Name: PermissionQROfficeRevoke, Description: "Allow admin to revoke office dynamic QR"},
		{Name: PermissionQROfficeView, Description: "Allow admin to view office dynamic QR"},

		{Name: PermissionReportsView, Description: "Allow user to view reports"},
		{Name: PermissionReportsExport, Description: "Allow user to export reports"},

		{Name: PermissionSettingsView, Description: "Allow user to view settings"},
		{Name: PermissionSettingsUpdate, Description: "Allow user to update settings"},
	}

	for _, p := range permissions {
		var existing models.Permission
		if err := db.Where("name = ?", p.Name).First(&existing).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&p).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}
	}

	// Define role mappings
	roleMappings := map[models.UserRole][]string{
		models.RoleAdmin: {
			PermissionAuthLogin, PermissionAuthLogout, PermissionDashboardView,
			PermissionEmployeesView, PermissionEmployeesCreate, PermissionEmployeesUpdate, PermissionEmployeesDelete,
			PermissionEmployeesQRView, PermissionEmployeesQRRegen, PermissionEmployeesQRRevoke,
			PermissionOfficesView, PermissionOfficesCreate, PermissionOfficesUpdate, PermissionOfficesDelete,
			PermissionShiftsView, PermissionShiftsCreate, PermissionShiftsUpdate, PermissionShiftsDelete,
			PermissionAttendanceSelfView, PermissionAttendanceSelfCheckIn, PermissionAttendanceSelfCheckOut, PermissionAttendanceHistoryView,
			PermissionAttendanceAdminView, PermissionAttendanceAdminScan, PermissionAttendanceAdminOverride, PermissionAttendanceAdminReport,
			PermissionQROfficeGenerate, PermissionQROfficeRevoke, PermissionQROfficeView,
			PermissionReportsView, PermissionReportsExport,
			PermissionSettingsView, PermissionSettingsUpdate,
		},
		models.RoleHR: {
			PermissionAuthLogin, PermissionAuthLogout, PermissionDashboardView,
			PermissionEmployeesView, PermissionEmployeesCreate, PermissionEmployeesUpdate,
			PermissionEmployeesQRView, PermissionEmployeesQRRegen,
			PermissionOfficesView, PermissionShiftsView,
			PermissionAttendanceSelfView, PermissionAttendanceSelfCheckIn, PermissionAttendanceSelfCheckOut, PermissionAttendanceHistoryView,
			PermissionAttendanceAdminView, PermissionAttendanceAdminReport,
			PermissionQROfficeGenerate, PermissionQROfficeView,
			PermissionReportsView, PermissionReportsExport,
		},
		models.RoleManager: {
			PermissionAuthLogin, PermissionAuthLogout, PermissionDashboardView,
			PermissionEmployeesView, PermissionOfficesView, PermissionShiftsView,
			PermissionAttendanceSelfView, PermissionAttendanceSelfCheckIn, PermissionAttendanceSelfCheckOut, PermissionAttendanceHistoryView,
			PermissionAttendanceAdminView, PermissionAttendanceAdminReport,
			PermissionReportsView,
		},
		models.RoleSecurity: {
			PermissionAuthLogin, PermissionAuthLogout, PermissionDashboardView,
			PermissionAttendanceAdminScan, PermissionQROfficeView,
			PermissionAttendanceSelfView, PermissionAttendanceHistoryView,
		},
		models.RoleEmployee: {
			PermissionAuthLogin, PermissionAuthLogout, PermissionDashboardView,
			PermissionAttendanceSelfView, PermissionAttendanceSelfCheckIn, PermissionAttendanceSelfCheckOut, PermissionAttendanceHistoryView,
			PermissionSettingsView,
		},
	}

	for role, permNames := range roleMappings {
		for _, name := range permNames {
			var perm models.Permission
			if err := db.Where("name = ?", name).First(&perm).Error; err != nil {
				return fmt.Errorf("permission %s not found", name)
			}

			var rp models.RolePermission
			if err := db.Where("role = ? AND permission_id = ?", role, perm.ID).First(&rp).Error; err != nil {
				if err == gorm.ErrRecordNotFound {
					if err := db.Create(&models.RolePermission{
						Role:         role,
						PermissionID: perm.ID,
					}).Error; err != nil {
						return err
					}
				} else {
					return err
				}
			}
		}
	}

	return nil
}
