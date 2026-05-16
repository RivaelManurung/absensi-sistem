package rbac

import (
	"backend-absensi/internal/models"
	"backend-absensi/internal/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Handler struct {
	db  *gorm.DB
	svc *Service
}

func NewHandler(db *gorm.DB, svc *Service) *Handler {
	return &Handler{
		db:  db,
		svc: svc,
	}
}

type RoleItem struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	UserCount   int64    `json:"user_count"`
	Permissions []string `json:"permissions"`
}

func (h *Handler) ListRoles(c *gin.Context) {
	roles := []models.UserRole{
		models.RoleSuperAdmin,
		models.RoleAdmin,
		models.RoleHR,
		models.RoleManager,
		models.RoleSecurity,
		models.RoleEmployee,
	}

	res := make([]RoleItem, 0, len(roles))
	for _, r := range roles {
		var count int64
		h.db.Model(&models.User{}).Where("role = ?", r).Count(&count)

		perms := h.svc.GetRolePermissions(r)

		res = append(res, RoleItem{
			ID:          string(r),
			Name:        string(r),
			Description: "System defined role",
			UserCount:   count,
			Permissions: perms,
		})
	}

	response.Success(c, http.StatusOK, "Roles retrieved successfully", res)
}

func (h *Handler) GetRole(c *gin.Context) {
	roleID := c.Param("id")
	role := models.UserRole(roleID)

	var count int64
	h.db.Model(&models.User{}).Where("role = ?", role).Count(&count)

	perms := h.svc.GetRolePermissions(role)

	res := RoleItem{
		ID:          string(role),
		Name:        string(role),
		Description: "System defined role",
		UserCount:   count,
		Permissions: perms,
	}

	response.Success(c, http.StatusOK, "Role retrieved successfully", res)
}

func (h *Handler) ListPermissions(c *gin.Context) {
	var permissions []models.Permission
	if err := h.db.Find(&permissions).Error; err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve permissions", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Permissions retrieved successfully", permissions)
}

type SyncPermissionsRequest struct {
	PermissionIDs []uuid.UUID `json:"permission_ids" binding:"required"`
}

func (h *Handler) SyncPermissions(c *gin.Context) {
	roleID := c.Param("id")
	role := models.UserRole(roleID)

	if role == models.RoleSuperAdmin {
		response.Error(c, http.StatusBadRequest, "Cannot modify super_admin permissions", nil)
		return
	}

	var req SyncPermissionsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusUnprocessableEntity, "Validation error", err.Error())
		return
	}

	err := h.db.Transaction(func(tx *gorm.DB) error {
		// Delete existing permissions for this role
		if err := tx.Where("role = ?", role).Delete(&models.RolePermission{}).Error; err != nil {
			return err
		}

		// Insert new permissions
		for _, permID := range req.PermissionIDs {
			rp := models.RolePermission{
				Role:         role,
				PermissionID: permID,
			}
			if err := tx.Create(&rp).Error; err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to sync permissions", err.Error())
		return
	}

	// Reload RBAC cache
	h.svc.ReloadCache()

	response.Success(c, http.StatusOK, "Permissions synced successfully", nil)
}
