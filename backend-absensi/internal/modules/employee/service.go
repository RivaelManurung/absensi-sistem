package employee

import (
	"backend-absensi/internal/models"
	"backend-absensi/internal/pkg/password"
	"backend-absensi/internal/pkg/response"
	"errors"
	"math"

	"github.com/google/uuid"
)

type EmployeeRequest struct {
	Name         string `json:"name"`
	FullName     string `json:"full_name"`
	Email        string `json:"email" binding:"required,email"`
	Password     string `json:"password"`
	EmployeeCode string `json:"employee_code" binding:"required"`
	Phone        string `json:"phone"`
	Position     string `json:"position"`
	Department   string `json:"department"`
	OfficeID     string `json:"office_id" binding:"required"`
	ShiftID      string `json:"shift_id" binding:"required"`
	Role         string `json:"role"`
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
	fullName := req.displayName()
	if fullName == "" {
		return nil, errors.New("full_name is required")
	}

	pass := req.Password
	if pass == "" {
		pass = "password123" // Default password
	}

	hash, err := password.Hash(pass)
	if err != nil {
		return nil, err
	}
	isActive := activeOrDefault(req.IsActive, true)
	role, err := parseRole(req.Role)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Name:         fullName,
		Email:        req.Email,
		PasswordHash: hash,
		Role:         role,
		IsActive:     isActive,
	}

	officeID, err := uuid.Parse(req.OfficeID)
	if err != nil {
		return nil, errors.New("office_id must be a valid UUID")
	}
	shiftID, err := uuid.Parse(req.ShiftID)
	if err != nil {
		return nil, errors.New("shift_id must be a valid UUID")
	}

	employee := &models.Employee{
		EmployeeCode: req.EmployeeCode,
		FullName:     fullName,
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
	fullName := req.displayName()
	if fullName == "" {
		return nil, errors.New("full_name is required")
	}
	role, err := parseRole(req.Role)
	if err != nil {
		return nil, err
	}

	user := &employee.User
	user.Name = fullName
	user.Email = req.Email
	user.Role = role
	isActive := activeOrDefault(req.IsActive, employee.IsActive)
	user.IsActive = isActive

	if req.Password != "" {
		hash, err := password.Hash(req.Password)
		if err != nil {
			return nil, err
		}
		user.PasswordHash = hash
	}

	officeID, err := uuid.Parse(req.OfficeID)
	if err != nil {
		return nil, errors.New("office_id must be a valid UUID")
	}
	shiftID, err := uuid.Parse(req.ShiftID)
	if err != nil {
		return nil, errors.New("shift_id must be a valid UUID")
	}

	employee.EmployeeCode = req.EmployeeCode
	employee.FullName = fullName
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

func (r EmployeeRequest) displayName() string {
	if r.FullName != "" {
		return r.FullName
	}
	return r.Name
}

func parseRole(value string) (models.UserRole, error) {
	switch value {
	case "", string(models.RoleEmployee):
		return models.RoleEmployee, nil
	case string(models.RoleAdmin):
		return models.RoleAdmin, nil
	case string(models.RoleHR):
		return models.RoleHR, nil
	default:
		return "", errors.New("role must be one of admin, hr, employee")
	}
}
