package auth

import (
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
	userID, ok := c.Get("user_id")
	if !ok {
		response.Error(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	res, err := h.svc.GetMe(userID.(string))
	if err != nil {
		response.Error(c, http.StatusNotFound, "User not found", err.Error())
		return
	}

	res.Permissions = h.rbacSvc.GetRolePermissions(res.User.Role)

	// Return user data with permissions merged in
	returnResponse := gin.H{
		"id":          res.User.ID,
		"name":        res.User.Name,
		"email":       res.User.Email,
		"role":        res.User.Role,
		"is_active":   res.User.IsActive,
		"permissions": res.Permissions,
	}

	response.Success(c, http.StatusOK, "Success", returnResponse)
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
