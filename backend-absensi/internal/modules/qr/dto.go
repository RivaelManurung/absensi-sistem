package qr

import "time"

type GenerateOfficeQRRequest struct {
	Purpose    string `json:"purpose" binding:"required,oneof=check_in check_out both"`
	TTLSeconds int    `json:"ttl_seconds" binding:"required,min=10,max=3600"`
	ShiftID    string `json:"shift_id"`
}

type QRAttendanceRequest struct {
	QRToken   string  `json:"qr_token" binding:"required"`
	Latitude  float64 `json:"latitude" binding:"required"`
	Longitude float64 `json:"longitude" binding:"required"`
	Accuracy  float64 `json:"accuracy" binding:"required"`
	DeviceID  string  `json:"device_id" binding:"required"`
}

type ScanEmployeeQRRequest struct {
	EmployeeQRToken string  `json:"employee_qr_token" binding:"required"`
	Action          string  `json:"action" binding:"required,oneof=check_in check_out"`
	Latitude        float64 `json:"latitude" binding:"required"`
	Longitude       float64 `json:"longitude" binding:"required"`
	Accuracy        float64 `json:"accuracy" binding:"required"`
	DeviceID        string  `json:"device_id" binding:"required"`
}

type QRResponse struct {
	EmployeeID     string    `json:"employee_id,omitempty"`
	EmployeeCode   string    `json:"employee_code,omitempty"`
	SessionID      string    `json:"session_id,omitempty"`
	OfficeID       string    `json:"office_id,omitempty"`
	Purpose        string    `json:"purpose,omitempty"`
	ExpiresAt      time.Time `json:"expires_at,omitempty"`
	QRToken        string    `json:"qr_token"`
	QRImageDataURL string    `json:"qr_image_data_url"`
	Status         string    `json:"status,omitempty"`
	CreatedAt      time.Time `json:"created_at,omitempty"`
}

type UnifiedScanRequest struct {
	QRCode    string  `json:"qr_code" binding:"required"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Accuracy  float64 `json:"accuracy"`
	DeviceID  string  `json:"device_id"`
}
