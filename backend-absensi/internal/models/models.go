package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Base struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (b *Base) BeforeCreate(tx *gorm.DB) error {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return nil
}

type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleHR       UserRole = "hr"
	RoleEmployee UserRole = "employee"
)

type User struct {
	Base
	Name         string     `gorm:"size:255" json:"name"`
	Email        string     `gorm:"size:255;uniqueIndex" json:"email"`
	PasswordHash string     `gorm:"size:255" json:"-"`
	Role         UserRole   `gorm:"type:varchar(20)" json:"role"`
	IsActive     bool       `gorm:"default:true" json:"is_active"`
	LastLoginAt  *time.Time `json:"last_login_at"`
}

type Office struct {
	Base
	Name               string  `gorm:"size:255" json:"name"`
	Code               string  `gorm:"size:20;uniqueIndex" json:"code"`
	Address            string  `gorm:"type:text" json:"address"`
	Latitude           float64 `gorm:"type:decimal(10,8)" json:"latitude"`
	Longitude          float64 `gorm:"type:decimal(11,8)" json:"longitude"`
	AllowedRadiusMeter int     `gorm:"default:100" json:"allowed_radius_meter"`
	IsActive           bool    `gorm:"default:true" json:"is_active"`
}

type Shift struct {
	Base
	Name                 string `gorm:"size:255" json:"name"`
	Code                 string `gorm:"size:20;uniqueIndex" json:"code"`
	StartTime            string `gorm:"size:5" json:"start_time"` // HH:mm
	EndTime              string `gorm:"size:5" json:"end_time"`
	CheckInStart         string `gorm:"size:5" json:"check_in_start"`
	CheckInEnd           string `gorm:"size:5" json:"check_in_end"`
	CheckOutStart        string `gorm:"size:5" json:"check_out_start"`
	CheckOutEnd          string `gorm:"size:5" json:"check_out_end"`
	LateToleranceMinutes int    `gorm:"default:0" json:"late_tolerance_minutes"`
	BreakDurationMinutes int    `gorm:"default:60" json:"break_duration_minutes"`
	IsActive             bool   `gorm:"default:true" json:"is_active"`
}

type Employee struct {
	Base
	UserID       uuid.UUID `gorm:"type:uuid;uniqueIndex" json:"user_id"`
	User         User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	EmployeeCode string    `gorm:"size:50;uniqueIndex" json:"employee_code"`
	FullName     string    `gorm:"size:255" json:"full_name"`
	Phone        string    `gorm:"size:20" json:"phone"`
	Position     string    `gorm:"size:100" json:"position"`
	Department   string    `gorm:"size:100" json:"department"`
	OfficeID     uuid.UUID `gorm:"type:uuid" json:"office_id"`
	Office       Office    `gorm:"foreignKey:OfficeID" json:"office,omitempty"`
	ShiftID      uuid.UUID `gorm:"type:uuid" json:"shift_id"`
	Shift        Shift     `gorm:"foreignKey:ShiftID" json:"shift,omitempty"`
	DeviceID     string    `gorm:"size:255" json:"device_id"`
	IsActive     bool      `gorm:"default:true" json:"is_active"`
}

type AttendanceStatus string

const (
	StatusPresent         AttendanceStatus = "present"
	StatusLate            AttendanceStatus = "late"
	StatusAbsent          AttendanceStatus = "absent"
	StatusCheckedIn       AttendanceStatus = "checked_in"
	StatusCheckedOut      AttendanceStatus = "checked_out"
	StatusOutsideRadius   AttendanceStatus = "outside_radius"
	StatusInvalidLocation AttendanceStatus = "invalid_location"
	StatusPending         AttendanceStatus = "pending"
)

type Attendance struct {
	Base
	EmployeeID            uuid.UUID        `gorm:"type:uuid;index;uniqueIndex:idx_employee_date" json:"employee_id"`
	Employee              Employee         `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
	OfficeID              uuid.UUID        `gorm:"type:uuid" json:"office_id"`
	ShiftID               uuid.UUID        `gorm:"type:uuid" json:"shift_id"`
	AttendanceDate        time.Time        `gorm:"type:date;index;uniqueIndex:idx_employee_date" json:"attendance_date"`
	CheckInAt             *time.Time       `json:"check_in_at"`
	CheckInLatitude       *float64         `gorm:"type:decimal(10,8)" json:"check_in_latitude"`
	CheckInLongitude      *float64         `gorm:"type:decimal(11,8)" json:"check_in_longitude"`
	CheckInAccuracy       *float64         `gorm:"type:decimal(10,2)" json:"check_in_accuracy"`
	CheckInDistanceMeter  *float64         `gorm:"type:decimal(10,2)" json:"check_in_distance_meter"`
	CheckOutAt            *time.Time       `json:"check_out_at"`
	CheckOutLatitude      *float64         `gorm:"type:decimal(10,8)" json:"check_out_latitude"`
	CheckOutLongitude     *float64         `gorm:"type:decimal(11,8)" json:"check_out_longitude"`
	CheckOutAccuracy      *float64         `gorm:"type:decimal(10,2)" json:"check_out_accuracy"`
	CheckOutDistanceMeter *float64         `gorm:"type:decimal(10,2)" json:"check_out_distance_meter"`
	Status                AttendanceStatus `gorm:"type:varchar(20)" json:"status"`
	LateMinutes           int              `gorm:"default:0" json:"late_minutes"`
	Notes                 string           `gorm:"type:text" json:"notes"`
}

type AttendanceLog struct {
	ID            uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	EmployeeID    uuid.UUID `gorm:"type:uuid;index" json:"employee_id"`
	UserID        uuid.UUID `gorm:"type:uuid;index" json:"user_id"`
	Action        string    `gorm:"size:20" json:"action"` // check_in, check_out
	Latitude      float64   `gorm:"type:decimal(10,8)" json:"latitude"`
	Longitude     float64   `gorm:"type:decimal(11,8)" json:"longitude"`
	Accuracy      float64   `gorm:"type:decimal(10,2)" json:"accuracy"`
	DistanceMeter float64   `gorm:"type:decimal(10,2)" json:"distance_meter"`
	Status        string    `gorm:"size:20" json:"status"` // success, failed
	Reason        string    `gorm:"type:text" json:"reason"`
	DeviceID      string    `gorm:"size:255" json:"device_id"`
	IPAddress     string    `gorm:"size:45" json:"ip_address"`
	UserAgent     string    `gorm:"type:text" json:"user_agent"`
	CreatedAt     time.Time `json:"created_at"`
}

func (al *AttendanceLog) BeforeCreate(tx *gorm.DB) error {
	if al.ID == uuid.Nil {
		al.ID = uuid.New()
	}
	return nil
}

type RefreshToken struct {
	ID        uuid.UUID  `gorm:"type:uuid;primaryKey" json:"id"`
	UserID    uuid.UUID  `gorm:"type:uuid;index" json:"user_id"`
	TokenHash string     `gorm:"size:255" json:"-"`
	ExpiresAt time.Time  `json:"expires_at"`
	RevokedAt *time.Time `json:"revoked_at"`
	CreatedAt time.Time  `json:"created_at"`
}

func (rt *RefreshToken) BeforeCreate(tx *gorm.DB) error {
	if rt.ID == uuid.Nil {
		rt.ID = uuid.New()
	}
	return nil
}
