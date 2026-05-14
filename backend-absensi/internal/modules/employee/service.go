package employee

import (
	"backend-absensi/internal/models"
	"backend-absensi/internal/pkg/password"
	"backend-absensi/internal/pkg/response"
	"math"

	"github.com/google/uuid"
)

type EmployeeRequest struct {
	Name         string `json:"name" binding:"required"`
	Email        string `json:"email" binding:"required,email"`
	Password     string `json:"password"`
	EmployeeCode string `json:"employee_code" binding:"required"`
	Phone        string `json:"phone"`
	Position     string `json:"position"`
	Department   string `json:"department"`
	OfficeID     string `json:"office_id" binding:"required"`
	ShiftID      string `json:"shift_id" binding:"required"`
	IsActive     *bool  `json:"is_active"`
}

type Service interface {
	GetAll(page, limit int, search string, dept string, officeID string) (*response.PageData, error)
	GetByID(id string) (*models.Employee, error)
	Create(req EmployeeRequest) (*models.Employee, error)
	Update(id string, req EmployeeRequest) (*models.Employee, error)
	Delete(id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo}
}

func (s *service) GetAll(page, limit int, search string, dept string, officeID string) (*response.PageData, error) {
	items, total, err := s.repo.FindAll(page, limit, search, dept, officeID)
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

func (s *service) GetByID(id string) (*models.Employee, error) {
	return s.repo.FindByID(id)
}

func (s *service) Create(req EmployeeRequest) (*models.Employee, error) {
	pass := req.Password
	if pass == "" {
		pass = "password123" // Default password
	}

	hash, _ := password.Hash(pass)
	isActive := activeOrDefault(req.IsActive, true)

	user := &models.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: hash,
		Role:         models.RoleEmployee,
		IsActive:     isActive,
	}

	officeID, _ := uuid.Parse(req.OfficeID)
	shiftID, _ := uuid.Parse(req.ShiftID)

	employee := &models.Employee{
		EmployeeCode: req.EmployeeCode,
		FullName:     req.Name,
		Phone:        req.Phone,
		Position:     req.Position,
		Department:   req.Department,
		OfficeID:     officeID,
		ShiftID:      shiftID,
		IsActive:     isActive,
	}

	if err := s.repo.Create(employee, user); err != nil {
		return nil, err
	}

	return employee, nil
}

func (s *service) Update(id string, req EmployeeRequest) (*models.Employee, error) {
	employee, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	user := &employee.User
	user.Name = req.Name
	user.Email = req.Email
	isActive := activeOrDefault(req.IsActive, employee.IsActive)
	user.IsActive = isActive

	if req.Password != "" {
		hash, _ := password.Hash(req.Password)
		user.PasswordHash = hash
	}

	officeID, _ := uuid.Parse(req.OfficeID)
	shiftID, _ := uuid.Parse(req.ShiftID)

	employee.EmployeeCode = req.EmployeeCode
	employee.FullName = req.Name
	employee.Phone = req.Phone
	employee.Position = req.Position
	employee.Department = req.Department
	employee.OfficeID = officeID
	employee.ShiftID = shiftID
	employee.IsActive = isActive

	if err := s.repo.Update(employee, user); err != nil {
		return nil, err
	}

	return employee, nil
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
