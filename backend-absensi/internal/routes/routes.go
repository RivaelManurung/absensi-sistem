package routes

import (
	"backend-absensi/internal/config"
	"backend-absensi/internal/middleware"
	"backend-absensi/internal/modules/attendance"
	"backend-absensi/internal/modules/auth"
	"backend-absensi/internal/modules/employee"
	"backend-absensi/internal/modules/office"
	"backend-absensi/internal/modules/shift"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
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
		authHandler := auth.NewHandler(authSvc)

		authGroup := api.Group("/auth")
		{
			authGroup.POST("/login", authHandler.Login)
			authGroup.GET("/me", middleware.AuthMiddleware(cfg), authHandler.Me)
		}

		// Protected Routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware(cfg))
		{
			// Attendance (Employee)
			attRepo := attendance.NewRepository(db)
			attSvc := attendance.NewService(attRepo, cfg)
			repSvc := attendance.NewReportService(attRepo)
			attHandler := attendance.NewHandler(attSvc, repSvc)

			protected.POST("/attendance/check-in", attHandler.CheckIn)
			protected.POST("/attendance/check-out", attHandler.CheckOut)
			protected.GET("/attendance/today", attHandler.GetToday)
			protected.GET("/attendance/history", attHandler.GetHistory)

			// Admin Routes
			admin := protected.Group("/admin")
			admin.Use(middleware.RoleMiddleware("admin", "hr"))
			{
				admin.GET("/attendance/report", attHandler.GetReport)

				// Employee Management
				empRepo := employee.NewRepository(db)
				empSvc := employee.NewService(empRepo)
				empHandler := employee.NewHandler(empSvc)

				admin.GET("/employees", empHandler.GetAll)
				admin.POST("/employees", empHandler.Create)
				admin.GET("/employees/:id", empHandler.GetByID)
				admin.PUT("/employees/:id", empHandler.Update)
				admin.DELETE("/employees/:id", empHandler.Delete)

				// Office Management
				offRepo := office.NewRepository(db)
				offSvc := office.NewService(offRepo)
				offHandler := office.NewHandler(offSvc)

				admin.GET("/offices", offHandler.GetAll)
				admin.POST("/offices", offHandler.Create)
				admin.GET("/offices/:id", offHandler.GetByID)
				admin.PUT("/offices/:id", offHandler.Update)
				admin.DELETE("/offices/:id", offHandler.Delete)

				// Shift Management
				shfRepo := shift.NewRepository(db)
				shfSvc := shift.NewService(shfRepo)
				shfHandler := shift.NewHandler(shfSvc)

				admin.GET("/shifts", shfHandler.GetAll)
				admin.POST("/shifts", shfHandler.Create)
				admin.GET("/shifts/:id", shfHandler.GetByID)
				admin.PUT("/shifts/:id", shfHandler.Update)
				admin.DELETE("/shifts/:id", shfHandler.Delete)
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
