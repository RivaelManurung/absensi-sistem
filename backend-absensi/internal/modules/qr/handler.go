package qr

import (
	"backend-absensi/internal/models"
	"backend-absensi/internal/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	qrService *Service
}

func NewHandler(qrService *Service) *Handler {
	return &Handler{
		qrService: qrService,
	}
}

// Admin/HR: Get Employee QR
func (h *Handler) GetEmployeeQR(c *gin.Context) {
	idStr := c.Param("id")
	employeeID, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid employee ID", nil)
		return
	}

	qr, err := h.qrService.GetActiveEmployeeQR(employeeID)
	if err != nil {
		response.Error(c, http.StatusNotFound, "active QR not found", nil)
		return
	}

	// Note: We don't return the raw token for security, 
	// unless we implement a way to decrypt it or just return a fresh one via regenerate
	response.Success(c, http.StatusOK, "employee QR retrieved", qr)
}

// Admin/HR: Regenerate Employee QR
func (h *Handler) RegenerateEmployeeQR(c *gin.Context) {
	idStr := c.Param("id")
	employeeID, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid employee ID", nil)
		return
	}

	adminID := c.MustGet("user_id").(uuid.UUID)

	qrRecord, rawToken, qrDataURL, err := h.qrService.GenerateEmployeeQR(employeeID, adminID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to generate QR", err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "employee QR regenerated", QRResponse{
		EmployeeID:     qrRecord.EmployeeID.String(),
		QRToken:        rawToken,
		QRImageDataURL: qrDataURL,
		Status:         qrRecord.Status,
		CreatedAt:      qrRecord.CreatedAt,
	})
}

// Employee: My QR
func (h *Handler) GetMyQR(c *gin.Context) {
	// This requires mapping user_id to employee_id
	// For simplicity, let's assume we fetch employee by user_id
	// (You might need a helper function or inject employee service)
}

// Admin/HR: Generate Office QR Session
func (h *Handler) GenerateOfficeQRSession(c *gin.Context) {
	officeIDStr := c.Param("officeId")
	officeID, err := uuid.Parse(officeIDStr)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "invalid office ID", nil)
		return
	}

	var req GenerateOfficeQRRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "validation error", err.Error())
		return
	}

	var shiftID *uuid.UUID
	if req.ShiftID != "" {
		sid, err := uuid.Parse(req.ShiftID)
		if err == nil {
			shiftID = &sid
		}
	}

	adminID := c.MustGet("user_id").(uuid.UUID)

	session, rawToken, qrDataURL, err := h.qrService.GenerateOfficeQRSession(officeID, shiftID, req.Purpose, req.TTLSeconds, adminID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "failed to generate session", err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "QR attendance session generated", QRResponse{
		SessionID:      session.ID.String(),
		OfficeID:       session.OfficeID.String(),
		Purpose:        session.Purpose,
		ExpiresAt:      session.ExpiresAt,
		QRToken:        rawToken,
		QRImageDataURL: qrDataURL,
	})
}

func (h *Handler) LogAudit(actorID uuid.UUID, action, entityType string, entityID uuid.UUID, metadata string, c *gin.Context) {
	h.qrService.LogAudit(&models.AuditLog{
		ActorUserID: actorID,
		Action:      action,
		EntityType:  entityType,
		EntityID:    entityID,
		Metadata:    metadata,
		IPAddress:   c.ClientIP(),
		UserAgent:   c.Request.UserAgent(),
	})
}
