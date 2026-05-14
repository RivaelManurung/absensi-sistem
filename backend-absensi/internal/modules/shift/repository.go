package shift

import (
	"backend-absensi/internal/models"
	"gorm.io/gorm"
)

type Repository interface {
	FindAll(page, limit int) ([]models.Shift, int64, error)
	FindByID(id string) (*models.Shift, error)
	Create(shift *models.Shift) error
	Update(shift *models.Shift) error
	Delete(id string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) FindAll(page, limit int) ([]models.Shift, int64, error) {
	var shifts []models.Shift
	var total int64

	query := r.db.Model(&models.Shift{})
	query.Count(&total)
	offset := (page - 1) * limit
	err := query.Offset(offset).Limit(limit).Order("created_at desc").Find(&shifts).Error

	return shifts, total, err
}

func (r *repository) FindByID(id string) (*models.Shift, error) {
	var shift models.Shift
	err := r.db.First(&shift, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &shift, nil
}

func (r *repository) Create(shift *models.Shift) error {
	return r.db.Create(shift).Error
}

func (r *repository) Update(shift *models.Shift) error {
	return r.db.Save(shift).Error
}

func (r *repository) Delete(id string) error {
	return r.db.Delete(&models.Shift{}, "id = ?", id).Error
}
