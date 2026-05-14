package office

import (
	"backend-absensi/internal/models"
	"gorm.io/gorm"
)

type Repository interface {
	FindAll(page, limit int, search string) ([]models.Office, int64, error)
	FindByID(id string) (*models.Office, error)
	Create(office *models.Office) error
	Update(office *models.Office) error
	Delete(id string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) FindAll(page, limit int, search string) ([]models.Office, int64, error) {
	var offices []models.Office
	var total int64

	query := r.db.Model(&models.Office{})
	if search != "" {
		query = query.Where("name ILIKE ? OR code ILIKE ? OR address ILIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	query.Count(&total)
	offset := (page - 1) * limit
	err := query.Offset(offset).Limit(limit).Order("created_at desc").Find(&offices).Error

	return offices, total, err
}

func (r *repository) FindByID(id string) (*models.Office, error) {
	var office models.Office
	err := r.db.First(&office, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &office, nil
}

func (r *repository) Create(office *models.Office) error {
	return r.db.Create(office).Error
}

func (r *repository) Update(office *models.Office) error {
	return r.db.Save(office).Error
}

func (r *repository) Delete(id string) error {
	return r.db.Delete(&models.Office{}, "id = ?", id).Error
}
