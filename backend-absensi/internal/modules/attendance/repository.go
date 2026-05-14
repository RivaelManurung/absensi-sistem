package attendance

import (
	"backend-absensi/internal/models"
	"time"

	"gorm.io/gorm"
)

type Repository interface {
	FindEmployeeByUserID(userID string) (*models.Employee, error)
	GetTodayAttendance(employeeID string) (*models.Attendance, error)
	CreateAttendance(attendance *models.Attendance) error
	UpdateAttendance(attendance *models.Attendance) error
	CreateLog(log *models.AttendanceLog) error
	GetHistory(employeeID string, page, limit int) ([]models.Attendance, int64, error)
	GetReport(filters map[string]interface{}, page, limit int) ([]models.Attendance, int64, error)
	GetReportSummary(filters map[string]interface{}) (map[string]int, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) FindEmployeeByUserID(userID string) (*models.Employee, error) {
	var emp models.Employee
	err := r.db.Preload("Office").Preload("Shift").Where("user_id = ?", userID).First(&emp).Error
	return &emp, err
}

func (r *repository) GetTodayAttendance(employeeID string) (*models.Attendance, error) {
	var att models.Attendance
	today := time.Now().Format("2006-01-02")
	err := r.db.Where("employee_id = ? AND attendance_date = ?", employeeID, today).First(&att).Error
	if err != nil {
		return nil, err
	}
	return &att, nil
}

func (r *repository) CreateAttendance(attendance *models.Attendance) error {
	return r.db.Create(attendance).Error
}

func (r *repository) UpdateAttendance(attendance *models.Attendance) error {
	return r.db.Save(attendance).Error
}

func (r *repository) CreateLog(log *models.AttendanceLog) error {
	return r.db.Create(log).Error
}

func (r *repository) GetHistory(employeeID string, page, limit int) ([]models.Attendance, int64, error) {
	var items []models.Attendance
	var total int64

	query := r.db.Model(&models.Attendance{}).Where("employee_id = ?", employeeID)
	query.Count(&total)
	offset := (page - 1) * limit
	err := query.Offset(offset).Limit(limit).Order("attendance_date desc").Find(&items).Error

	return items, total, err
}

func (r *repository) GetReport(filters map[string]interface{}, page, limit int) ([]models.Attendance, int64, error) {
	var items []models.Attendance
	var total int64

	query := r.db.Model(&models.Attendance{}).Preload("Employee.User").Preload("Employee.Office").Preload("Employee.Shift")
	query = applyReportFilters(query, filters)

	query.Count(&total)
	offset := (page - 1) * limit
	err := query.Offset(offset).Limit(limit).Order("attendance_date desc, created_at desc").Find(&items).Error

	return items, total, err
}

func (r *repository) GetReportSummary(filters map[string]interface{}) (map[string]int, error) {
	type row struct {
		Status string
		Total  int
	}

	var rows []row
	query := applyReportFilters(r.db.Model(&models.Attendance{}), filters)
	if err := query.Select("status, COUNT(*) AS total").Group("status").Scan(&rows).Error; err != nil {
		return nil, err
	}

	summary := map[string]int{
		"total_present":     0,
		"total_late":        0,
		"total_absent":      0,
		"total_checked_in":  0,
		"total_checked_out": 0,
	}
	for _, item := range rows {
		switch models.AttendanceStatus(item.Status) {
		case models.StatusPresent:
			summary["total_present"] = item.Total
		case models.StatusLate:
			summary["total_late"] = item.Total
		case models.StatusAbsent:
			summary["total_absent"] = item.Total
		case models.StatusCheckedIn:
			summary["total_checked_in"] = item.Total
		case models.StatusCheckedOut:
			summary["total_checked_out"] = item.Total
		}
	}

	return summary, nil
}

func applyReportFilters(query *gorm.DB, filters map[string]interface{}) *gorm.DB {
	if val, ok := filters["employee_id"]; ok {
		query = query.Where("employee_id = ?", val)
	}
	if val, ok := filters["office_id"]; ok {
		query = query.Where("office_id = ?", val)
	}
	if val, ok := filters["status"]; ok {
		query = query.Where("status = ?", val)
	}
	if val, ok := filters["start_date"]; ok {
		query = query.Where("attendance_date >= ?", val)
	}
	if val, ok := filters["end_date"]; ok {
		query = query.Where("attendance_date <= ?", val)
	}
	return query
}
