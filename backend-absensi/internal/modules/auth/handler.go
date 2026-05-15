package auth

import (
	"backend-absensi/internal/models"
	"backend-absensi/internal/modules/rbac"
	"backend-absensi/internal/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	svc     Service
	rbacSvc *rbac.Service
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

func NewHandler(svc Service, rbacSvc *rbac.Service) *Handler {
	return &Handler{svc, rbacSvc}
}

func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusUnprocessableEntity, "Validation error", err.Error())
		return
	}

	res, err := h.svc.Login(req)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, err.Error(), nil)
		return
	}

	res.Permissions = h.rbacSvc.GetRolePermissions(res.User.Role)

	response.Success(c, http.StatusOK, "Login successful", res)
}

func (h *Handler) Me(c *gin.Context) {
	// Middleware will set the user claims
	userID, _ := c.Get("user_id")
	email, _ := c.Get("email")
	role, _ := c.Get("role")

	userRole := models.UserRole(role.(string))
	permissions := h.rbacSvc.GetRolePermissions(userRole)

	response.Success(c, http.StatusOK, "Success", gin.H{
		"id":          userID,
		"email":       email,
		"role":        role,
		"permissions": permissions,
	})
}

func (h *Handler) Refresh(c *gin.Context) {
	var req RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusUnprocessableEntity, "Validation error", err.Error())
		return
	}

	res, err := h.svc.RefreshToken(req.RefreshToken)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusOK, "Token refreshed", res)
}

func (h *Handler) Logout(c *gin.Context) {
	userID, ok := c.Get("user_id")
	if !ok {
		response.Error(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	if err := h.svc.Logout(userID.(string)); err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to logout", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Logout successful", nil)
}
