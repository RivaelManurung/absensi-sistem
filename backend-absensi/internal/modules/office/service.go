package office

import (
	"backend-absensi/internal/models"
	"backend-absensi/internal/pkg/response"
	"math"
)

type OfficeRequest struct {
	Name               string  `json:"name" binding:"required"`
	Code               string  `json:"code" binding:"required"`
	Address            string  `json:"address" binding:"required"`
	Latitude           float64 `json:"latitude" binding:"required,min=-90,max=90"`
	Longitude          float64 `json:"longitude" binding:"required,min=-180,max=180"`
	AllowedRadiusMeter int     `json:"allowed_radius_meter" binding:"required,min=20,max=1000"`
	IsActive           *bool   `json:"is_active"`
}

type Service interface {
	GetAll(page, limit int, search string) (*response.PageData, error)
	GetByID(id string) (*models.Office, error)
	Create(req OfficeRequest) (*models.Office, error)
	Update(id string, req OfficeRequest) (*models.Office, error)
	Delete(id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo}
}

func (s *service) GetAll(page, limit int, search string) (*response.PageData, error) {
	items, total, err := s.repo.FindAll(page, limit, search)
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

func (s *service) GetByID(id string) (*models.Office, error) {
	return s.repo.FindByID(id)
}

func (s *service) Create(req OfficeRequest) (*models.Office, error) {
	office := &models.Office{
		Name:               req.Name,
		Code:               req.Code,
		Address:            req.Address,
		Latitude:           req.Latitude,
		Longitude:          req.Longitude,
		AllowedRadiusMeter: req.AllowedRadiusMeter,
		IsActive:           activeOrDefault(req.IsActive, true),
	}

	if err := s.repo.Create(office); err != nil {
		return nil, err
	}
	return office, nil
}

func (s *service) Update(id string, req OfficeRequest) (*models.Office, error) {
	office, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	office.Name = req.Name
	office.Code = req.Code
	office.Address = req.Address
	office.Latitude = req.Latitude
	office.Longitude = req.Longitude
	office.AllowedRadiusMeter = req.AllowedRadiusMeter
	office.IsActive = activeOrDefault(req.IsActive, office.IsActive)

	if err := s.repo.Update(office); err != nil {
		return nil, err
	}
	return office, nil
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
