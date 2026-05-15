package qr

import (
	"backend-absensi/internal/modules/attendance"
	"backend-absensi/internal/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AttendanceQRHandler struct {
	qrService         *Service
	attendanceService attendance.Service
}

func NewAttendanceQRHandler(qrService *Service, attendanceService attendance.Service) *AttendanceQRHandler {
	return &AttendanceQRHandler{
		qrService:         qrService,
		attendanceService: attendanceService,
	}
}

// Mode B: Employee scan office dynamic QR
func (h *AttendanceQRHandler) QRCheckIn(c *gin.Context) {
	var req QRAttendanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "validation error", err.Error())
		return
	}

	session, err := h.qrService.ValidateOfficeQR(req.QRToken)
	if err != nil {
		response.Error(c, http.StatusUnprocessableEntity, err.Error(), nil)
		return
	}

	if session.Purpose != "check_in" && session.Purpose != "both" {
		response.Error(c, http.StatusUnprocessableEntity, "this QR is not for check-in", nil)
		return
	}

	userID := c.MustGet("user_id").(uuid.UUID).String()
	
	att, err := h.attendanceService.CheckIn(userID, attendance.CheckInRequest{
		Latitude:  req.Latitude,
		Longitude: req.Longitude,
		Accuracy:  req.Accuracy,
		DeviceID:  req.DeviceID,
	}, c.ClientIP(), c.Request.UserAgent())

	if err != nil {
		response.Error(c, http.StatusUnprocessableEntity, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusCreated, "QR check-in success", att)
}

func (h *AttendanceQRHandler) QRCheckOut(c *gin.Context) {
	var req QRAttendanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "validation error", err.Error())
		return
	}

	session, err := h.qrService.ValidateOfficeQR(req.QRToken)
	if err != nil {
		response.Error(c, http.StatusUnprocessableEntity, err.Error(), nil)
		return
	}

	if session.Purpose != "check_out" && session.Purpose != "both" {
		response.Error(c, http.StatusUnprocessableEntity, "this QR is not for check-out", nil)
		return
	}

	userID := c.MustGet("user_id").(uuid.UUID).String()

	att, err := h.attendanceService.CheckOut(userID, attendance.CheckOutRequest{
		Latitude:  req.Latitude,
		Longitude: req.Longitude,
		Accuracy:  req.Accuracy,
	}, c.ClientIP(), c.Request.UserAgent())

	if err != nil {
		response.Error(c, http.StatusUnprocessableEntity, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusOK, "QR check-out success", att)
}

// Mode A: Admin/Security scan employee QR
func (h *AttendanceQRHandler) ScanEmployeeQR(c *gin.Context) {
	var req ScanEmployeeQRRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "validation error", err.Error())
		return
	}

	qr, err := h.qrService.ValidateEmployeeQR(req.EmployeeQRToken)
	if err != nil {
		response.Error(c, http.StatusUnprocessableEntity, err.Error(), nil)
		return
	}

	// For Mode A, we need to bypass the "self" check-in logic
	// but still apply all business rules.
	// Since current attendanceService expects userID of the employee, 
	// we pass the employee's UserID.
	
	employeeUserID := qr.Employee.UserID.String()

	var att interface{}
	if req.Action == "check_in" {
		att, err = h.attendanceService.CheckIn(employeeUserID, attendance.CheckInRequest{
			Latitude:  req.Latitude,
			Longitude: req.Longitude,
			Accuracy:  req.Accuracy,
			DeviceID:  req.DeviceID,
			Notes:     "Scanned by " + c.MustGet("role").(string),
		}, c.ClientIP(), c.Request.UserAgent())
	} else {
		att, err = h.attendanceService.CheckOut(employeeUserID, attendance.CheckOutRequest{
			Latitude:  req.Latitude,
			Longitude: req.Longitude,
			Accuracy:  req.Accuracy,
		}, c.ClientIP(), c.Request.UserAgent())
	}

	if err != nil {
		response.Error(c, http.StatusUnprocessableEntity, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusOK, "employee QR scan success", att)
}

// Unified Scan: Automatically determine check-in or check-out
func (h *AttendanceQRHandler) UnifiedScan(c *gin.Context) {
	var req UnifiedScanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "validation error", err.Error())
		return
	}

	// 1. Validate QR Code (Employee Identity QR)
	qr, err := h.qrService.ValidateEmployeeQR(req.QRCode)
	if err != nil {
		response.Error(c, http.StatusUnprocessableEntity, "invalid or expired QR code", nil)
		return
	}

	employeeUserID := qr.Employee.UserID.String()

	// 2. Check today's attendance state
	existing, _ := h.attendanceService.GetToday(employeeUserID)

	var att interface{}
	var action string

	if existing == nil {
		// Logic: if no attendance today -> checkin
		action = "check_in"
		att, err = h.attendanceService.CheckIn(employeeUserID, attendance.CheckInRequest{
			Latitude:  req.Latitude,
			Longitude: req.Longitude,
			Accuracy:  req.Accuracy,
			DeviceID:  req.DeviceID,
			Notes:     "Scanned via Unified QR Scanner",
		}, c.ClientIP(), c.Request.UserAgent())
	} else if existing.CheckOutAt == nil {
		// else if already checkin and no checkout -> checkout
		action = "check_out"
		att, err = h.attendanceService.CheckOut(employeeUserID, attendance.CheckOutRequest{
			Latitude:  req.Latitude,
			Longitude: req.Longitude,
			Accuracy:  req.Accuracy,
		}, c.ClientIP(), c.Request.UserAgent())
	} else {
		// already checked out today
		response.Error(c, http.StatusConflict, "already checked out for today", nil)
		return
	}

	if err != nil {
		response.Error(c, http.StatusUnprocessableEntity, err.Error(), nil)
		return
	}

	message := "Check-in successful"
	if action == "check_out" {
		message = "Check-out successful"
	}

	response.Success(c, http.StatusOK, message, gin.H{
		"employee_name": qr.Employee.FullName,
		"type":          action,
		"attendance":    att,
	})
}
