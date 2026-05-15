package employee

import (
	"backend-absensi/internal/models"
	"gorm.io/gorm"
)

type Repository interface {
	FindAll(page, limit int, search string, department string, officeID string) ([]models.Employee, int64, error)
	FindByID(id string) (*models.Employee, error)
	Create(employee *models.Employee, user *models.User) error
	Update(employee *models.Employee, user *models.User) error
	Delete(id string) error
	FindByEmail(email string) (*models.Employee, error)
	FindByCode(code string) (*models.Employee, error)
	FindByUserID(userID string) (*models.Employee, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) FindAll(page, limit int, search string, department string, officeID string) ([]models.Employee, int64, error) {
	var employees []models.Employee
	var total int64

	query := r.db.Model(&models.Employee{}).Preload("User").Preload("Office").Preload("Shift")
	
	if search != "" {
		query = query.Joins("JOIN users ON users.id = employees.user_id").
			Where("employees.full_name ILIKE ? OR employees.employee_code ILIKE ? OR users.email ILIKE ?", 
				"%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if department != "" {
		query = query.Where("department = ?", department)
	}

	if officeID != "" {
		query = query.Where("office_id = ?", officeID)
	}

	query.Count(&total)
	offset := (page - 1) * limit
	err := query.Offset(offset).Limit(limit).Order("created_at desc").Find(&employees).Error

	return employees, total, err
}

func (r *repository) FindByID(id string) (*models.Employee, error) {
	var employee models.Employee
	err := r.db.Preload("User").Preload("Office").Preload("Shift").First(&employee, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &employee, nil
}

func (r *repository) Create(employee *models.Employee, user *models.User) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(user).Error; err != nil {
			return err
		}
		employee.UserID = user.ID
		if err := tx.Create(employee).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *repository) Update(employee *models.Employee, user *models.User) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(user).Error; err != nil {
			return err
		}
		if err := tx.Save(employee).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *repository) Delete(id string) error {
	var employee models.Employee
	if err := r.db.First(&employee, "id = ?", id).Error; err != nil {
		return err
	}

	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&models.User{}, "id = ?", employee.UserID).Error; err != nil {
			return err
		}
		if err := tx.Delete(&models.Employee{}, "id = ?", id).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *repository) FindByEmail(email string) (*models.Employee, error) {
	var employee models.Employee
	err := r.db.Joins("JOIN users ON users.id = employees.user_id").
		Where("users.email = ?", email).First(&employee).Error
	return &employee, err
}

func (r *repository) FindByCode(code string) (*models.Employee, error) {
	var employee models.Employee
	err := r.db.Where("employee_code = ?", code).First(&employee).Error
	return &employee, err
}

func (r *repository) FindByUserID(userID string) (*models.Employee, error) {
	var employee models.Employee
	err := r.db.Preload("User").Preload("Office").Preload("Shift").First(&employee, "user_id = ?", userID).Error
	if err != nil {
		return nil, err
	}
	return &employee, nil
}
