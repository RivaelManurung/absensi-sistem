package routes

import (
	"backend-absensi/internal/config"
	"backend-absensi/internal/middleware"
	"backend-absensi/internal/modules/attendance"
	"backend-absensi/internal/modules/auth"
	"backend-absensi/internal/modules/employee"
	"backend-absensi/internal/modules/office"
	"backend-absensi/internal/modules/qr"
	"backend-absensi/internal/modules/rbac"
	"backend-absensi/internal/modules/shift"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	r.Use(middleware.RequestIDMiddleware())
	r.Use(middleware.RequestLoggerMiddleware())

	// RBAC Module
	rbacSvc := rbac.NewService(db)

	// QR Module
	qrSvc := qr.NewService(db, cfg.QRSecret)
	qrHandler := qr.NewHandler(qrSvc)

	// CORS Configuration
	corsConfig := cors.Config{
		AllowOrigins:     allowedOrigins(cfg.CORSAllowedOrigins),
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: cfg.CORSAllowedOrigins != "*",
		MaxAge:           12 * time.Hour,
	}
	if cfg.CORSAllowedOrigins == "*" {
		corsConfig.AllowAllOrigins = true
		corsConfig.AllowOrigins = nil
	}
	r.Use(cors.New(corsConfig))

	api := r.Group("/api/v1")
	{
		// Auth Module
		authRepo := auth.NewRepository(db)
		authSvc := auth.NewService(authRepo, cfg)
		authHandler := auth.NewHandler(authSvc, rbacSvc)

		authGroup := api.Group("/auth")
		{
			authGroup.POST("/login", middleware.RateLimitMiddleware(cfg.LoginRateLimitPerMinute, time.Minute), authHandler.Login)
			authGroup.POST("/refresh", authHandler.Refresh)
			authGroup.GET("/me", middleware.AuthMiddleware(cfg), authHandler.Me)
			authGroup.POST("/logout", middleware.AuthMiddleware(cfg), authHandler.Logout)
		}

		// Protected Routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware(cfg))
		{
			// Initialize Repositories and Services
			attRepo := attendance.NewRepository(db)
			attSvc := attendance.NewService(attRepo, cfg)
			repSvc := attendance.NewReportService(attRepo)
			attHandler := attendance.NewHandler(attSvc, repSvc)

			empRepo := employee.NewRepository(db)
			empSvc := employee.NewService(empRepo)
			empHandler := employee.NewHandler(empSvc)

			offRepo := office.NewRepository(db)
			offSvc := office.NewService(offRepo)
			offHandler := office.NewHandler(offSvc)

			shfRepo := shift.NewRepository(db)
			shfSvc := shift.NewService(shfRepo)
			shfHandler := shift.NewHandler(shfSvc)

			qrAttHandler := qr.NewAttendanceQRHandler(qrSvc, attSvc)

			// Employee App Routes
			appGroup := protected.Group("/app")
			{
				appGroup.GET("/me", empHandler.GetMe)
				appGroup.PUT("/profile", empHandler.UpdateProfile)
				appGroup.GET("/office", empHandler.GetMyOffice)
				appGroup.GET("/me/qr", rbac.Middleware(rbacSvc, rbac.PermissionEmployeesQRRead), qrHandler.GetMyQR)
				appGroup.POST("/attendance/qr/check-in", rbac.Middleware(rbacSvc, rbac.PermissionAttendanceSelfCheckIn), qrAttHandler.QRCheckIn)
				appGroup.POST("/attendance/qr/check-out", rbac.Middleware(rbacSvc, rbac.PermissionAttendanceSelfCheckOut), qrAttHandler.QRCheckOut)
			}

			// Generic Attendance Routes
			protected.POST("/attendance/check-in", middleware.RateLimitMiddleware(cfg.AttendanceRateLimitPerMinute, time.Minute), attHandler.CheckIn)
			protected.POST("/attendance/check-out", middleware.RateLimitMiddleware(cfg.AttendanceRateLimitPerMinute, time.Minute), attHandler.CheckOut)
			protected.POST("/attendance/scan", middleware.RateLimitMiddleware(cfg.AttendanceRateLimitPerMinute, time.Minute), qrAttHandler.UnifiedScan)
			protected.GET("/attendance/today", attHandler.GetToday)
			protected.GET("/attendance/history", attHandler.GetHistory)

			// Admin Routes
			admin := protected.Group("/admin")
			{
				admin.GET("/attendance/report", rbac.Middleware(rbacSvc, rbac.PermissionAttendanceAdminReport), attHandler.GetReport)

				// QR Management (Admin/HR/Security)
				admin.GET("/employees/:id/qr", rbac.Middleware(rbacSvc, rbac.PermissionEmployeesQRRead), qrHandler.GetEmployeeQR)
				admin.POST("/employees/:id/qr/regenerate", rbac.Middleware(rbacSvc, rbac.PermissionEmployeesQRRegen), qrHandler.RegenerateEmployeeQR)
				admin.POST("/offices/:officeId/qr-sessions", rbac.Middleware(rbacSvc, rbac.PermissionQROfficeGenerate), qrHandler.GenerateOfficeQRSession)
				admin.POST("/attendance/qr/scan-employee", rbac.Middleware(rbacSvc, rbac.PermissionAttendanceAdminScan), qrAttHandler.ScanEmployeeQR)

				// Employee Management
				admin.GET("/employees", rbac.Middleware(rbacSvc, rbac.PermissionEmployeesRead), empHandler.GetAll)
				admin.POST("/employees", rbac.Middleware(rbacSvc, rbac.PermissionEmployeesCreate), empHandler.Create)
				admin.GET("/employees/:id", rbac.Middleware(rbacSvc, rbac.PermissionEmployeesRead), empHandler.GetByID)
				admin.PUT("/employees/:id", rbac.Middleware(rbacSvc, rbac.PermissionEmployeesUpdate), empHandler.Update)
				admin.DELETE("/employees/:id", rbac.Middleware(rbacSvc, rbac.PermissionEmployeesDelete), empHandler.Delete)

				// Office Management
				admin.GET("/offices", rbac.Middleware(rbacSvc, rbac.PermissionOfficesRead), offHandler.GetAll)
				admin.POST("/offices", rbac.Middleware(rbacSvc, rbac.PermissionOfficesCreate), offHandler.Create)
				admin.GET("/offices/:officeId", rbac.Middleware(rbacSvc, rbac.PermissionOfficesRead), offHandler.GetByID)
				admin.PUT("/offices/:officeId", rbac.Middleware(rbacSvc, rbac.PermissionOfficesUpdate), offHandler.Update)
				admin.DELETE("/offices/:officeId", rbac.Middleware(rbacSvc, rbac.PermissionOfficesDelete), offHandler.Delete)

				// Role & Permission Management
				rbacHandler := rbac.NewHandler(db, rbacSvc)
				admin.GET("/roles", rbac.Middleware(rbacSvc, rbac.PermissionRolesRead), rbacHandler.ListRoles)
				admin.GET("/roles/:id", rbac.Middleware(rbacSvc, rbac.PermissionRolesRead), rbacHandler.GetRole)
				admin.GET("/permissions", rbac.Middleware(rbacSvc, rbac.PermissionPermissionsRead), rbacHandler.ListPermissions)
				admin.PUT("/roles/:id/permissions", rbac.Middleware(rbacSvc, rbac.PermissionPermissionsAssign), rbacHandler.SyncPermissions)

				// Shift Management
				admin.GET("/shifts", rbac.Middleware(rbacSvc, rbac.PermissionShiftsRead), shfHandler.GetAll)
				admin.POST("/shifts", rbac.Middleware(rbacSvc, rbac.PermissionShiftsCreate), shfHandler.Create)
				admin.GET("/shifts/:id", rbac.Middleware(rbacSvc, rbac.PermissionShiftsRead), shfHandler.GetByID)
				admin.PUT("/shifts/:id", rbac.Middleware(rbacSvc, rbac.PermissionShiftsUpdate), shfHandler.Update)
				admin.DELETE("/shifts/:id", rbac.Middleware(rbacSvc, rbac.PermissionShiftsDelete), shfHandler.Delete)
			}
		}
	}
}

func allowedOrigins(value string) []string {
	if value == "" || value == "*" {
		return []string{"*"}
	}

	parts := strings.Split(value, ",")
	origins := make([]string, 0, len(parts))
	for _, part := range parts {
		origin := strings.TrimSpace(part)
		if origin != "" {
			origins = append(origins, origin)
		}
	}
	if len(origins) == 0 {
		return []string{"*"}
	}
	return origins
}
