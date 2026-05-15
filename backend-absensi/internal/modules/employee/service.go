package employee

import (
	"backend-absensi/internal/models"
	"backend-absensi/internal/pkg/password"
	"backend-absensi/internal/pkg/response"
	"errors"
	"math"

	"github.com/google/uuid"
	"time"
)

type EmployeeRequest struct {
	FullName         string `json:"full_name"`
	FirstName        string `json:"first_name"`
	LastName         string `json:"last_name"`
	Username         string `json:"username"`
	Email            string `json:"email" binding:"required,email"`
	Password         string `json:"password"`
	EmployeeCode     string `json:"employee_code" binding:"required"`
	Phone            string `json:"phone"`
	Gender           string `json:"gender"`
	BirthDate        string `json:"birth_date"` // YYYY-MM-DD
	Address          string `json:"address"`
	AvatarURL        string `json:"avatar_url"`
	Position         string `json:"position"`
	Department       string `json:"department"`
	OfficeID         string `json:"office_id" binding:"required"`
	ShiftID          string `json:"shift_id" binding:"required"`
	JoinDate         string `json:"join_date"`         // YYYY-MM-DD
	EmploymentStatus string `json:"employment_status"` // Full-time, Part-time, Contract, Probation
	EmergencyContact string `json:"emergency_contact"`
	EmergencyPhone   string `json:"emergency_phone"`
	Notes            string `json:"notes"`
	Role             string `json:"role"`
	IsActive         *bool  `json:"is_active"`
}

type ProfileUpdateRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password"`
	Phone     string `json:"phone"`
	Gender    string `json:"gender"`
	BirthDate string `json:"birth_date"`
	Address   string `json:"address"`
	AvatarURL string `json:"avatar_url"`
}

type Service interface {
	GetAll(page, limit int, search string, dept string, officeID string) (*response.PageData, error)
	GetByID(id string) (*models.Employee, error)
	GetByUserID(userID string) (*models.Employee, error)
	Create(req EmployeeRequest) (*models.Employee, error)
	Update(id string, req EmployeeRequest) (*models.Employee, error)
	UpdateProfile(userID string, req ProfileUpdateRequest) (*models.Employee, error)
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

	birthDate := parseDate(req.BirthDate)
	joinDate := parseDate(req.JoinDate)

	user := &models.User{
		Name:         fullName,
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: hash,
		Role:         role,
		AvatarURL:    req.AvatarURL,
		Gender:       req.Gender,
		BirthDate:    birthDate,
		Phone:        req.Phone,
		Address:      req.Address,
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
		EmployeeCode:     req.EmployeeCode,
		FullName:         fullName,
		Phone:            req.Phone,
		Position:         req.Position,
		Department:       req.Department,
		OfficeID:         officeID,
		ShiftID:          shiftID,
		JoinDate:         joinDate,
		EmploymentStatus: req.EmploymentStatus,
		EmergencyContact: req.EmergencyContact,
		EmergencyPhone:   req.EmergencyPhone,
		Notes:            req.Notes,
		IsActive:         isActive,
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

	birthDate := parseDate(req.BirthDate)
	joinDate := parseDate(req.JoinDate)

	user := &employee.User
	user.Name = fullName
	user.FirstName = req.FirstName
	user.LastName = req.LastName
	user.Username = req.Username
	user.Email = req.Email
	user.Role = role
	user.AvatarURL = req.AvatarURL
	user.Gender = req.Gender
	user.BirthDate = birthDate
	user.Phone = req.Phone
	user.Address = req.Address
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
	employee.JoinDate = joinDate
	employee.EmploymentStatus = req.EmploymentStatus
	employee.EmergencyContact = req.EmergencyContact
	employee.EmergencyPhone = req.EmergencyPhone
	employee.Notes = req.Notes
	employee.IsActive = isActive

	if err := s.repo.Update(employee, user); err != nil {
		return nil, err
	}

	return employee, nil
}

func (s *service) Delete(id string) error {
	return s.repo.Delete(id)
}

func (s *service) GetByUserID(userID string) (*models.Employee, error) {
	return s.repo.FindByUserID(userID)
}

func (s *service) UpdateProfile(userID string, req ProfileUpdateRequest) (*models.Employee, error) {
	employee, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}

	birthDate := parseDate(req.BirthDate)

	user := &employee.User
	if req.FirstName != "" || req.LastName != "" {
		user.Name = req.FirstName + " " + req.LastName
	}
	user.FirstName = req.FirstName
	user.LastName = req.LastName
	user.Username = req.Username
	user.Email = req.Email
	user.AvatarURL = req.AvatarURL
	user.Gender = req.Gender
	user.BirthDate = birthDate
	user.Phone = req.Phone
	user.Address = req.Address

	if req.Password != "" {
		hash, err := password.Hash(req.Password)
		if err != nil {
			return nil, err
		}
		user.PasswordHash = hash
	}

	employee.FullName = user.Name
	employee.Phone = req.Phone

	if err := s.repo.Update(employee, user); err != nil {
		return nil, err
	}

	return employee, nil
}

func activeOrDefault(value *bool, fallback bool) bool {
	if value == nil {
		return fallback
	}
	return *value
}

func (r EmployeeRequest) displayName() string {
	return r.FullName
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

func parseDate(value string) *time.Time {
	if value == "" {
		return nil
	}
	t, err := time.Parse("2006-01-02", value)
	if err != nil {
		return nil
	}
	return &t
}
