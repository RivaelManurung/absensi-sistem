package qr

import (
	"backend-absensi/internal/modules/rbac"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.RouterGroup, handler *Handler, qrAttHandler *AttendanceQRHandler, rbacSvc *rbac.Service) {
	// Admin/HR/Security Routes
	admin := router.Group("/admin")
	{
		// Employee QR Management
		admin.GET("/employees/:id/qr", rbac.Middleware(rbacSvc, rbac.PermissionEmployeesQRView), handler.GetEmployeeQR)
		admin.POST("/employees/:id/qr/regenerate", rbac.Middleware(rbacSvc, rbac.PermissionEmployeesQRRegen), handler.RegenerateEmployeeQR)

		// Office QR Session Management
		admin.POST("/offices/:id/qr-sessions", rbac.Middleware(rbacSvc, rbac.PermissionQROfficeGenerate), handler.GenerateOfficeQRSession)

		// Attendance Scanner (Security/Admin)
		admin.POST("/attendance/qr/scan-employee", rbac.Middleware(rbacSvc, rbac.PermissionAttendanceAdminScan), qrAttHandler.ScanEmployeeQR)
	}

	// Employee App Routes
	app := router.Group("/app")
	{
		// Employee Self QR
		app.GET("/me/qr", rbac.Middleware(rbacSvc, rbac.PermissionEmployeesQRView), handler.GetMyQR)

		// QR Attendance
		app.POST("/attendance/qr/check-in", rbac.Middleware(rbacSvc, rbac.PermissionAttendanceSelfCheckIn), qrAttHandler.QRCheckIn)
		app.POST("/attendance/qr/check-out", rbac.Middleware(rbacSvc, rbac.PermissionAttendanceSelfCheckOut), qrAttHandler.QRCheckOut)
	}
}
