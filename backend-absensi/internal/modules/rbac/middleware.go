package rbac

import (
	"backend-absensi/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Middleware(rbacService *Service, permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "unauthorized: role not found in context",
			})
			c.Abort()
			return
		}

		userRole := models.UserRole(role.(string))
		if !rbacService.HasPermission(userRole, permission) {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"message": "forbidden: you do not have permission to access this resource",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
