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
		{Name: PermissionDashboardRead, Description: "Allow user to read dashboard data"},
		
		{Name: PermissionEmployeesRead, Description: "Allow user to read employee list"},
		{Name: PermissionEmployeesCreate, Description: "Allow user to create new employee"},
		{Name: PermissionEmployeesUpdate, Description: "Allow user to update employee"},
		{Name: PermissionEmployeesDelete, Description: "Allow user to delete employee"},
		{Name: PermissionEmployeesQRRead, Description: "Allow user to read employee QR"},
		{Name: PermissionEmployeesQRRegen, Description: "Allow user to regenerate employee QR"},
		{Name: PermissionEmployeesQRRevoke, Description: "Allow user to revoke employee QR"},

		{Name: PermissionOfficesRead, Description: "Allow user to read offices"},
		{Name: PermissionOfficesCreate, Description: "Allow user to create office"},
		{Name: PermissionOfficesUpdate, Description: "Allow user to update office"},
		{Name: PermissionOfficesDelete, Description: "Allow user to delete office"},

		{Name: PermissionShiftsRead, Description: "Allow user to read shifts"},
		{Name: PermissionShiftsCreate, Description: "Allow user to create shift"},
		{Name: PermissionShiftsUpdate, Description: "Allow user to update shift"},
		{Name: PermissionShiftsDelete, Description: "Allow user to delete shift"},

		{Name: PermissionAttendanceSelfRead, Description: "Allow user to read own attendance"},
		{Name: PermissionAttendanceSelfCheckIn, Description: "Allow user to self check-in"},
		{Name: PermissionAttendanceSelfCheckOut, Description: "Allow user to self check-out"},
		{Name: PermissionAttendanceHistoryRead, Description: "Allow user to read attendance history"},

		{Name: PermissionAttendanceAdminRead, Description: "Allow admin to read all attendance"},
		{Name: PermissionAttendanceAdminScan, Description: "Allow admin/security to scan employee QR"},
		{Name: PermissionAttendanceAdminOverride, Description: "Allow admin to override attendance"},
		{Name: PermissionAttendanceAdminReport, Description: "Allow admin to view attendance reports"},

		{Name: PermissionQROfficeGenerate, Description: "Allow admin to generate office dynamic QR"},
		{Name: PermissionQROfficeRevoke, Description: "Allow admin to revoke office dynamic QR"},
		{Name: PermissionQROfficeRead, Description: "Allow admin to read office dynamic QR"},

		{Name: PermissionReportsRead, Description: "Allow user to read reports"},
		{Name: PermissionReportsExport, Description: "Allow user to export reports"},

		{Name: PermissionSettingsRead, Description: "Allow user to read settings"},
		{Name: PermissionSettingsUpdate, Description: "Allow user to update settings"},
		{Name: PermissionSettingsManage, Description: "Allow user to manage settings"},

		{Name: PermissionUsersRead, Description: "Allow admin to read users"},
		{Name: PermissionUsersCreate, Description: "Allow admin to create user"},
		{Name: PermissionUsersUpdate, Description: "Allow admin to update user"},
		{Name: PermissionUsersDelete, Description: "Allow admin to delete user"},

		{Name: PermissionRolesRead, Description: "Allow admin to read roles"},
		{Name: PermissionRolesCreate, Description: "Allow admin to create role"},
		{Name: PermissionRolesUpdate, Description: "Allow admin to update role"},
		{Name: PermissionRolesDelete, Description: "Allow admin to delete role"},

		{Name: PermissionPermissionsRead, Description: "Allow admin to read permissions"},
		{Name: PermissionPermissionsAssign, Description: "Allow admin to assign permissions"},
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
			PermissionAuthLogin, PermissionAuthLogout, PermissionDashboardRead,
			PermissionEmployeesRead, PermissionEmployeesCreate, PermissionEmployeesUpdate, PermissionEmployeesDelete,
			PermissionEmployeesQRRead, PermissionEmployeesQRRegen, PermissionEmployeesQRRevoke,
			PermissionOfficesRead, PermissionOfficesCreate, PermissionOfficesUpdate, PermissionOfficesDelete,
			PermissionShiftsRead, PermissionShiftsCreate, PermissionShiftsUpdate, PermissionShiftsDelete,
			PermissionAttendanceSelfRead, PermissionAttendanceSelfCheckIn, PermissionAttendanceSelfCheckOut, PermissionAttendanceHistoryRead,
			PermissionAttendanceAdminRead, PermissionAttendanceAdminScan, PermissionAttendanceAdminOverride, PermissionAttendanceAdminReport,
			PermissionQROfficeGenerate, PermissionQROfficeRevoke, PermissionQROfficeRead,
			PermissionReportsRead, PermissionReportsExport,
			PermissionSettingsRead, PermissionSettingsUpdate, PermissionSettingsManage,
			PermissionUsersRead, PermissionUsersCreate, PermissionUsersUpdate, PermissionUsersDelete,
			PermissionRolesRead, PermissionRolesCreate, PermissionRolesUpdate, PermissionRolesDelete,
			PermissionPermissionsRead, PermissionPermissionsAssign,
		},
		models.RoleHR: {
			PermissionAuthLogin, PermissionAuthLogout, PermissionDashboardRead,
			PermissionEmployeesRead, PermissionEmployeesCreate, PermissionEmployeesUpdate,
			PermissionEmployeesQRRead, PermissionEmployeesQRRegen,
			PermissionOfficesRead, PermissionShiftsRead,
			PermissionAttendanceSelfRead, PermissionAttendanceSelfCheckIn, PermissionAttendanceSelfCheckOut, PermissionAttendanceHistoryRead,
			PermissionAttendanceAdminRead, PermissionAttendanceAdminReport,
			PermissionQROfficeGenerate, PermissionQROfficeRead,
			PermissionReportsRead, PermissionReportsExport,
		},
		models.RoleManager: {
			PermissionAuthLogin, PermissionAuthLogout, PermissionDashboardRead,
			PermissionEmployeesRead, PermissionOfficesRead, PermissionShiftsRead,
			PermissionAttendanceSelfRead, PermissionAttendanceSelfCheckIn, PermissionAttendanceSelfCheckOut, PermissionAttendanceHistoryRead,
			PermissionAttendanceAdminRead, PermissionAttendanceAdminReport,
			PermissionReportsRead,
		},
		models.RoleSecurity: {
			PermissionAuthLogin, PermissionAuthLogout, PermissionDashboardRead,
			PermissionAttendanceAdminScan, PermissionQROfficeRead,
			PermissionAttendanceSelfRead, PermissionAttendanceHistoryRead,
		},
		models.RoleEmployee: {
			PermissionAuthLogin, PermissionAuthLogout, PermissionDashboardRead,
			PermissionAttendanceSelfRead, PermissionAttendanceSelfCheckIn, PermissionAttendanceSelfCheckOut, PermissionAttendanceHistoryRead,
			PermissionSettingsRead,
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
