package attendance

import (
	"backend-absensi/internal/config"
	"backend-absensi/internal/models"
	"backend-absensi/internal/pkg/geolocation"
	"backend-absensi/internal/pkg/response"
	"errors"
	"fmt"
	"math"
	"time"

	"github.com/google/uuid"
)

type CheckInRequest struct {
	Latitude  float64 `json:"latitude" binding:"required"`
	Longitude float64 `json:"longitude" binding:"required"`
	Accuracy  float64 `json:"accuracy" binding:"required"`
	DeviceID  string  `json:"device_id" binding:"required"`
	Notes     string  `json:"notes"`
}

type CheckOutRequest struct {
	Latitude  float64 `json:"latitude" binding:"required"`
	Longitude float64 `json:"longitude" binding:"required"`
	Accuracy  float64 `json:"accuracy" binding:"required"`
}

type Service interface {
	CheckIn(userID string, req CheckInRequest, ip, ua string) (*models.Attendance, error)
	CheckOut(userID string, req CheckOutRequest, ip, ua string) (*models.Attendance, error)
	GetToday(userID string) (*models.Attendance, error)
	GetHistory(userID string, page, limit int) (*response.PageData, error)
}

type service struct {
	repo Repository
	cfg  *config.Config
}

func NewService(repo Repository, cfg *config.Config) Service {
	return &service{repo, cfg}
}

func (s *service) CheckIn(userID string, req CheckInRequest, ip, ua string) (*models.Attendance, error) {
	if err := validateLocation(req.Latitude, req.Longitude, req.Accuracy); err != nil {
		return nil, err
	}

	emp, err := s.repo.FindEmployeeByUserID(userID)
	if err != nil {
		return nil, errors.New("employee profile not found")
	}

	if !emp.IsActive {
		return nil, errors.New("employee is inactive")
	}

	// Validate Accuracy
	if req.Accuracy > s.cfg.MaxLocationAccuracy {
		s.logAttendance(emp, userID, "check_in", req.Latitude, req.Longitude, req.Accuracy, 0, "failed", "Accuracy too low", req.DeviceID, ip, ua)
		return nil, fmt.Errorf("location accuracy too low (%.2f > %.2f)", req.Accuracy, s.cfg.MaxLocationAccuracy)
	}

	// Calculate Distance if geofence is enabled
	var dist float64
	if emp.Office.GeofenceEnabled {
		if emp.Office.Latitude == nil || emp.Office.Longitude == nil {
			return nil, errors.New("office location not configured for geofencing")
		}
		dist = geolocation.DistanceMeters(req.Latitude, req.Longitude, *emp.Office.Latitude, *emp.Office.Longitude)
		if dist > float64(emp.Office.AllowedRadiusMeter) {
			s.logAttendance(emp, userID, "check_in", req.Latitude, req.Longitude, req.Accuracy, dist, "failed", "Outside radius", req.DeviceID, ip, ua)
			return nil, fmt.Errorf("you are outside the allowed radius (%.2f meters)", dist)
		}
	} else {
		// Even if geofence is disabled, we still calculate distance for logging if coordinates are available
		if emp.Office.Latitude != nil && emp.Office.Longitude != nil {
			dist = geolocation.DistanceMeters(req.Latitude, req.Longitude, *emp.Office.Latitude, *emp.Office.Longitude)
		}
	}

	// Validate Shift Timing
	now := time.Now()
	nowTime := now.Format("15:04")
	if !isTimeWithinWindow(nowTime, emp.Shift.CheckInStart, emp.Shift.CheckInEnd) {
		s.logAttendance(emp, userID, "check_in", req.Latitude, req.Longitude, req.Accuracy, dist, "failed", "Outside check-in window", req.DeviceID, ip, ua)
		return nil, errors.New("outside check-in window for your shift")
	}

	// Check Duplicate
	existing, _ := s.repo.GetTodayAttendance(emp.ID.String())
	if existing != nil {
		return nil, errors.New("you have already checked in today")
	}

	// Determine Status (Present vs Late)
	status := models.StatusPresent
	lateMinutes := 0

	// Parse shift start time for today
	shiftStartStr := fmt.Sprintf("%s %s:00", now.Format("2006-01-02"), emp.Shift.StartTime)
	shiftStartTime, _ := time.ParseInLocation("2006-01-02 15:04:05", shiftStartStr, now.Location())

	tolerance := time.Duration(emp.Shift.LateToleranceMinutes) * time.Minute
	if now.After(shiftStartTime.Add(tolerance)) {
		status = models.StatusLate
		lateMinutes = int(now.Sub(shiftStartTime).Minutes())
	}

	att := &models.Attendance{
		EmployeeID:           emp.ID,
		OfficeID:             emp.OfficeID,
		ShiftID:              emp.ShiftID,
		AttendanceDate:       now,
		CheckInAt:            &now,
		CheckInLatitude:      &req.Latitude,
		CheckInLongitude:     &req.Longitude,
		CheckInAccuracy:      &req.Accuracy,
		CheckInDistanceMeter: &dist,
		Status:               status,
		LateMinutes:          lateMinutes,
		Notes:                req.Notes,
	}

	if err := s.repo.CreateAttendance(att); err != nil {
		return nil, err
	}

	s.logAttendance(emp, userID, "check_in", req.Latitude, req.Longitude, req.Accuracy, dist, "success", "", req.DeviceID, ip, ua)

	return att, nil
}

func (s *service) CheckOut(userID string, req CheckOutRequest, ip, ua string) (*models.Attendance, error) {
	if err := validateLocation(req.Latitude, req.Longitude, req.Accuracy); err != nil {
		return nil, err
	}

	emp, err := s.repo.FindEmployeeByUserID(userID)
	if err != nil {
		return nil, errors.New("employee profile not found")
	}

	att, err := s.repo.GetTodayAttendance(emp.ID.String())
	if err != nil {
		return nil, errors.New("no check-in found for today")
	}

	if att.CheckOutAt != nil {
		return nil, errors.New("you have already checked out today")
	}

	// Validate Accuracy & Distance
	if req.Accuracy > s.cfg.MaxLocationAccuracy {
		s.logAttendance(emp, userID, "check_out", req.Latitude, req.Longitude, req.Accuracy, 0, "failed", "Accuracy too low", "", ip, ua)
		return nil, fmt.Errorf("location accuracy too low (%.2f > %.2f)", req.Accuracy, s.cfg.MaxLocationAccuracy)
	}

	var dist float64
	if emp.Office.GeofenceEnabled {
		if emp.Office.Latitude == nil || emp.Office.Longitude == nil {
			return nil, errors.New("office location not configured for geofencing")
		}
		dist = geolocation.DistanceMeters(req.Latitude, req.Longitude, *emp.Office.Latitude, *emp.Office.Longitude)
		if dist > float64(emp.Office.AllowedRadiusMeter) {
			s.logAttendance(emp, userID, "check_out", req.Latitude, req.Longitude, req.Accuracy, dist, "failed", "Outside radius", "", ip, ua)
			return nil, fmt.Errorf("you are outside the allowed radius (%.2f meters)", dist)
		}
	} else {
		// Even if geofence is disabled, we still calculate distance for logging if coordinates are available
		if emp.Office.Latitude != nil && emp.Office.Longitude != nil {
			dist = geolocation.DistanceMeters(req.Latitude, req.Longitude, *emp.Office.Latitude, *emp.Office.Longitude)
		}
	}

	// Validate Shift Check-out Window
	now := time.Now()
	nowTime := now.Format("15:04")
	if !isTimeWithinWindow(nowTime, emp.Shift.CheckOutStart, emp.Shift.CheckOutEnd) {
		s.logAttendance(emp, userID, "check_out", req.Latitude, req.Longitude, req.Accuracy, dist, "failed", "Outside check-out window", "", ip, ua)
		return nil, errors.New("outside check-out window for your shift")
	}

	att.CheckOutAt = &now
	att.CheckOutLatitude = &req.Latitude
	att.CheckOutLongitude = &req.Longitude
	att.CheckOutAccuracy = &req.Accuracy
	att.CheckOutDistanceMeter = &dist
	att.Status = models.StatusCheckedOut

	if err := s.repo.UpdateAttendance(att); err != nil {
		return nil, err
	}

	s.logAttendance(emp, userID, "check_out", req.Latitude, req.Longitude, req.Accuracy, dist, "success", "", "", ip, ua)

	return att, nil
}

func (s *service) GetToday(userID string) (*models.Attendance, error) {
	emp, _ := s.repo.FindEmployeeByUserID(userID)
	if emp == nil {
		return nil, errors.New("employee not found")
	}
	return s.repo.GetTodayAttendance(emp.ID.String())
}

func (s *service) GetHistory(userID string, page, limit int) (*response.PageData, error) {
	emp, _ := s.repo.FindEmployeeByUserID(userID)
	if emp == nil {
		return nil, errors.New("employee not found")
	}

	items, total, err := s.repo.GetHistory(emp.ID.String(), page, limit)
	if err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	return &response.PageData{
		Items: items,
		Meta: response.Meta{
			Page:       page,
			Limit:      limit,
			Total:      total,
			TotalPages: totalPages,
		},
	}, nil
}

func (s *service) logAttendance(emp *models.Employee, userID, action string, lat, lon, acc, dist float64, status, reason, deviceID, ip, ua string) {
	uID, _ := uuid.Parse(userID)
	log := &models.AttendanceLog{
		EmployeeID:    emp.ID,
		UserID:        uID,
		Action:        action,
		Latitude:      lat,
		Longitude:     lon,
		Accuracy:      acc,
		DistanceMeter: dist,
		Status:        status,
		Reason:        reason,
		DeviceID:      deviceID,
		IPAddress:     ip,
		UserAgent:     ua,
	}
	_ = s.repo.CreateLog(log)
}

func validateLocation(latitude, longitude, accuracy float64) error {
	if latitude < -90 || latitude > 90 {
		return errors.New("latitude must be between -90 and 90")
	}
	if longitude < -180 || longitude > 180 {
		return errors.New("longitude must be between -180 and 180")
	}
	if accuracy <= 0 {
		return errors.New("accuracy must be greater than 0")
	}
	return nil
}

func isTimeWithinWindow(current, start, end string) bool {
	if start <= end {
		return current >= start && current <= end
	}
	return current >= start || current <= end
}
