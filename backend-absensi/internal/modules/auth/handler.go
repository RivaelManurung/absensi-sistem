package auth

import (
	"backend-absensi/internal/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) *Handler {
	return &Handler{svc}
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

	response.Success(c, http.StatusOK, "Login successful", res)
}

func (h *Handler) Me(c *gin.Context) {
	// Middleware will set the user claims
	userID, _ := c.Get("user_id")
	email, _ := c.Get("email")
	role, _ := c.Get("role")

	response.Success(c, http.StatusOK, "Success", gin.H{
		"id":    userID,
		"email": email,
		"role":  role,
	})
}
