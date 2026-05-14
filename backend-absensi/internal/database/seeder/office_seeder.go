package seeder

import (
	"backend-absensi/internal/models"

	"gorm.io/gorm"
)

func seedOffices(tx *gorm.DB) (Result, error) {
	offices := []models.Office{
		{Name: "Jakarta Headquarters", Code: "JKT", Address: "Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan", Latitude: -6.224728, Longitude: 106.809922, AllowedRadiusMeter: 150, IsActive: true},
		{Name: "Bandung Branch Office", Code: "BDG", Address: "Jl. Asia Afrika No. 81, Bandung", Latitude: -6.921851, Longitude: 107.607271, AllowedRadiusMeter: 120, IsActive: true},
		{Name: "Surabaya Regional Office", Code: "SBY", Address: "Jl. Pemuda No. 33, Surabaya", Latitude: -7.265757, Longitude: 112.745007, AllowedRadiusMeter: 150, IsActive: true},
		{Name: "Medan Branch Office", Code: "MDN", Address: "Jl. Diponegoro No. 30, Medan", Latitude: 3.583659, Longitude: 98.672317, AllowedRadiusMeter: 130, IsActive: true},
		{Name: "Semarang Service Office", Code: "SMG", Address: "Jl. Pandanaran No. 100, Semarang", Latitude: -6.987391, Longitude: 110.417172, AllowedRadiusMeter: 120, IsActive: true},
		{Name: "Yogyakarta Branch Office", Code: "YGY", Address: "Jl. Margo Utomo No. 45, Yogyakarta", Latitude: -7.782848, Longitude: 110.367073, AllowedRadiusMeter: 110, IsActive: true},
		{Name: "Denpasar Operations Office", Code: "DPS", Address: "Jl. Teuku Umar No. 88, Denpasar", Latitude: -8.670458, Longitude: 115.212629, AllowedRadiusMeter: 140, IsActive: true},
		{Name: "Makassar Regional Office", Code: "MKS", Address: "Jl. Jenderal Sudirman No. 12, Makassar", Latitude: -5.139710, Longitude: 119.412411, AllowedRadiusMeter: 150, IsActive: true},
		{Name: "Balikpapan Site Office", Code: "BPN", Address: "Jl. Jenderal Sudirman No. 1, Balikpapan", Latitude: -1.265386, Longitude: 116.831200, AllowedRadiusMeter: 180, IsActive: true},
		{Name: "Palembang Branch Office", Code: "PLM", Address: "Jl. Kapten A. Rivai No. 25, Palembang", Latitude: -2.976074, Longitude: 104.749718, AllowedRadiusMeter: 130, IsActive: false},
	}

	result := Result{}
	for _, office := range offices {
		var existing models.Office
		err := tx.Where("code = ?", office.Code).First(&existing).Error
		if err == nil {
			result.Skipped++
			continue
		}
		if err != gorm.ErrRecordNotFound {
			return result, err
		}
		if err := tx.Create(&office).Error; err != nil {
			return result, err
		}
		result.Created++
	}

	return result, nil
}
