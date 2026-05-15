package qr

import (
	"backend-absensi/internal/modules/rbac"

	"github.com/gin-gonic/gin"
)

// SetupRoutes registers QR-related routes.
// Deprecated: Routes are now registered directly in internal/routes/routes.go
// to avoid parameter name conflicts and ensure consistent middleware application.
func SetupRoutes(router *gin.RouterGroup, handler *Handler, qrAttHandler *AttendanceQRHandler, rbacSvc *rbac.Service) {
	// This function is kept for backward compatibility or until callers are migrated.
	// It is currently NOT used in the main application.
}
