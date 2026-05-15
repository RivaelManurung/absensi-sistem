package qr

import (
	"backend-absensi/internal/models"
	"backend-absensi/internal/pkg/crypto"
	"encoding/base64"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/skip2/go-qrcode"
	"gorm.io/gorm"
)

type Service struct {
	db       *gorm.DB
	qrSecret string
}

func NewService(db *gorm.DB, qrSecret string) *Service {
	return &Service{
		db:       db,
		qrSecret: qrSecret,
	}
}

// Employee QR logic

func (s *Service) GenerateEmployeeQR(employeeID uuid.UUID, createdBy uuid.UUID) (*models.EmployeeQRCode, string, string, error) {
	// Revoke existing active QR
	s.db.Model(&models.EmployeeQRCode{}).
		Where("employee_id = ? AND status = 'active'", employeeID).
		Updates(map[string]interface{}{
			"status":     "revoked",
			"revoked_at": time.Now(),
			"revoked_by": createdBy,
		})

	rawToken, err := crypto.GenerateOpaqueToken("empqr", 32)
	if err != nil {
		return nil, "", "", err
	}

	tokenHash := crypto.HashToken(rawToken, s.qrSecret)

	qrRecord := &models.EmployeeQRCode{
		EmployeeID: employeeID,
		TokenHash:  tokenHash,
		Status:     "active",
		CreatedBy:  createdBy,
	}

	if err := s.db.Create(qrRecord).Error; err != nil {
		return nil, "", "", err
	}

	qrDataURL, err := s.generateQRDataURL(rawToken)
	if err != nil {
		return nil, "", "", err
	}

	return qrRecord, rawToken, qrDataURL, nil
}

func (s *Service) GetActiveEmployeeQR(employeeID uuid.UUID) (*models.EmployeeQRCode, error) {
	var qr models.EmployeeQRCode
	if err := s.db.Where("employee_id = ? AND status = 'active'", employeeID).First(&qr).Error; err != nil {
		return nil, err
	}
	return &qr, nil
}

// Office QR Session logic

func (s *Service) GenerateOfficeQRSession(officeID uuid.UUID, shiftID *uuid.UUID, purpose string, ttlSeconds int, createdBy uuid.UUID) (*models.QRAttendanceSession, string, string, error) {
	rawToken, err := crypto.GenerateOpaqueToken("officeqr", 32)
	if err != nil {
		return nil, "", "", err
	}

	tokenHash := crypto.HashToken(rawToken, s.qrSecret)
	expiresAt := time.Now().Add(time.Duration(ttlSeconds) * time.Second)

	session := &models.QRAttendanceSession{
		OfficeID:         officeID,
		ShiftID:          shiftID,
		SessionTokenHash: tokenHash,
		Purpose:          purpose,
		ExpiresAt:        expiresAt,
		CreatedBy:        createdBy,
		Status:           "active",
	}

	if err := s.db.Create(session).Error; err != nil {
		return nil, "", "", err
	}

	qrDataURL, err := s.generateQRDataURL(rawToken)
	if err != nil {
		return nil, "", "", err
	}

	return session, rawToken, qrDataURL, nil
}

func (s *Service) ValidateOfficeQR(rawToken string) (*models.QRAttendanceSession, error) {
	tokenHash := crypto.HashToken(rawToken, s.qrSecret)

	var session models.QRAttendanceSession
	if err := s.db.Preload("Office").Where("session_token_hash = ?", tokenHash).First(&session).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid QR code")
		}
		return nil, err
	}

	if session.Status != "active" {
		return nil, errors.New("QR code has been revoked")
	}

	if time.Now().After(session.ExpiresAt) {
		return nil, errors.New("QR code has expired")
	}

	return &session, nil
}

func (s *Service) ValidateEmployeeQR(rawToken string) (*models.EmployeeQRCode, error) {
	tokenHash := crypto.HashToken(rawToken, s.qrSecret)

	var qr models.EmployeeQRCode
	if err := s.db.Preload("Employee").Where("token_hash = ?", tokenHash).First(&qr).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid employee QR code")
		}
		return nil, err
	}

	if qr.Status != "active" {
		return nil, errors.New("employee QR code has been revoked")
	}

	return &qr, nil
}

// Internal helpers

func (s *Service) generateQRDataURL(text string) (string, error) {
	png, err := qrcode.Encode(text, qrcode.Medium, 256)
	if err != nil {
		return "", err
	}
	return "data:image/png;base64," + base64.StdEncoding.EncodeToString(png), nil
}

func (s *Service) LogScan(scan *models.QRAttendanceScan) error {
	return s.db.Create(scan).Error
}

func (s *Service) LogAudit(log *models.AuditLog) error {
	return s.db.Create(log).Error
}
