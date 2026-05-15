package shift

import (
	"backend-absensi/internal/models"
	"backend-absensi/internal/pkg/response"
	"errors"
	"math"
	"time"
)

type ShiftRequest struct {
	Name                 string `json:"name" binding:"required"`
	Code                 string `json:"code" binding:"required"`
	StartTime            string `json:"start_time" binding:"required"`
	EndTime              string `json:"end_time" binding:"required"`
	CheckInStart         string `json:"check_in_start" binding:"required"`
	CheckInEnd           string `json:"check_in_end" binding:"required"`
	CheckOutStart        string `json:"check_out_start" binding:"required"`
	CheckOutEnd          string `json:"check_out_end" binding:"required"`
	LateToleranceMinutes int    `json:"late_tolerance_minutes" binding:"min=0"`
	BreakDurationMinutes int    `json:"break_duration_minutes" binding:"min=0"`
	IsActive             *bool  `json:"is_active"`
}

type Service interface {
	GetAll(page, limit int) (*response.PageData, error)
	GetByID(id string) (*models.Shift, error)
	Create(req ShiftRequest) (*models.Shift, error)
	Update(id string, req ShiftRequest) (*models.Shift, error)
	Delete(id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo}
}

func (s *service) GetAll(page, limit int) (*response.PageData, error) {
	items, total, err := s.repo.FindAll(page, limit)
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

func (s *service) GetByID(id string) (*models.Shift, error) {
	return s.repo.FindByID(id)
}

func (s *service) Create(req ShiftRequest) (*models.Shift, error) {
	if err := validateShiftRequest(req); err != nil {
		return nil, err
	}

	shift := &models.Shift{
		Name:                 req.Name,
		Code:                 req.Code,
		StartTime:            req.StartTime,
		EndTime:              req.EndTime,
		CheckInStart:         req.CheckInStart,
		CheckInEnd:           req.CheckInEnd,
		CheckOutStart:        req.CheckOutStart,
		CheckOutEnd:          req.CheckOutEnd,
		LateToleranceMinutes: req.LateToleranceMinutes,
		BreakDurationMinutes: req.BreakDurationMinutes,
		IsActive:             activeOrDefault(req.IsActive, true),
	}

	if err := s.repo.Create(shift); err != nil {
		return nil, err
	}
	return shift, nil
}

func (s *service) Update(id string, req ShiftRequest) (*models.Shift, error) {
	if err := validateShiftRequest(req); err != nil {
		return nil, err
	}

	shift, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	shift.Name = req.Name
	shift.Code = req.Code
	shift.StartTime = req.StartTime
	shift.EndTime = req.EndTime
	shift.CheckInStart = req.CheckInStart
	shift.CheckInEnd = req.CheckInEnd
	shift.CheckOutStart = req.CheckOutStart
	shift.CheckOutEnd = req.CheckOutEnd
	shift.LateToleranceMinutes = req.LateToleranceMinutes
	shift.BreakDurationMinutes = req.BreakDurationMinutes
	shift.IsActive = activeOrDefault(req.IsActive, shift.IsActive)

	if err := s.repo.Update(shift); err != nil {
		return nil, err
	}
	return shift, nil
}

func (s *service) Delete(id string) error {
	return s.repo.Delete(id)
}

func activeOrDefault(value *bool, fallback bool) bool {
	if value == nil {
		return fallback
	}
	return *value
}

func validateShiftRequest(req ShiftRequest) error {
	fields := map[string]string{
		"start_time":      req.StartTime,
		"end_time":        req.EndTime,
		"check_in_start":  req.CheckInStart,
		"check_in_end":    req.CheckInEnd,
		"check_out_start": req.CheckOutStart,
		"check_out_end":   req.CheckOutEnd,
	}

	for field, value := range fields {
		if _, err := time.Parse("15:04", value); err != nil {
			return errors.New(field + " must use HH:mm format")
		}
	}

	if req.LateToleranceMinutes < 0 {
		return errors.New("late_tolerance_minutes cannot be negative")
	}
	if req.BreakDurationMinutes < 0 {
		return errors.New("break_duration_minutes cannot be negative")
	}

	return nil
}
