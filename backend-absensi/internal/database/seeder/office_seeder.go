package seeder

import (
	"backend-absensi/internal/models"

	"gorm.io/gorm"
)

func ptr(f float64) *float64 {
	return &f
}

func seedOffices(tx *gorm.DB) (Result, error) {
	offices := []models.Office{
		{Name: "Jakarta Headquarters", Code: "JKT", Address: "Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan", Latitude: ptr(-6.224728), Longitude: ptr(106.809922), AllowedRadiusMeter: 150, GeofenceEnabled: true, IsActive: true},
		{Name: "Bandung Branch Office", Code: "BDG", Address: "Jl. Asia Afrika No. 81, Bandung", Latitude: ptr(-6.921851), Longitude: ptr(107.607271), AllowedRadiusMeter: 120, GeofenceEnabled: true, IsActive: true},
		{Name: "Surabaya Regional Office", Code: "SBY", Address: "Jl. Pemuda No. 33, Surabaya", Latitude: ptr(-7.265757), Longitude: ptr(112.745007), AllowedRadiusMeter: 150, GeofenceEnabled: true, IsActive: true},
		{Name: "Medan Branch Office", Code: "MDN", Address: "Jl. Diponegoro No. 30, Medan", Latitude: ptr(3.583659), Longitude: ptr(98.672317), AllowedRadiusMeter: 130, GeofenceEnabled: true, IsActive: true},
		{Name: "Semarang Service Office", Code: "SMG", Address: "Jl. Pandanaran No. 100, Semarang", Latitude: ptr(-6.987391), Longitude: ptr(110.417172), AllowedRadiusMeter: 120, GeofenceEnabled: true, IsActive: true},
		{Name: "Yogyakarta Branch Office", Code: "YGY", Address: "Jl. Margo Utomo No. 45, Yogyakarta", Latitude: ptr(-7.782848), Longitude: ptr(110.367073), AllowedRadiusMeter: 110, GeofenceEnabled: true, IsActive: true},
		{Name: "Denpasar Operations Office", Code: "DPS", Address: "Jl. Teuku Umar No. 88, Denpasar", Latitude: ptr(-8.670458), Longitude: ptr(115.212629), AllowedRadiusMeter: 140, GeofenceEnabled: true, IsActive: true},
		{Name: "Makassar Regional Office", Code: "MKS", Address: "Jl. Jenderal Sudirman No. 12, Makassar", Latitude: ptr(-5.139710), Longitude: ptr(119.412411), AllowedRadiusMeter: 150, GeofenceEnabled: true, IsActive: true},
		{Name: "Balikpapan Site Office", Code: "BPN", Address: "Jl. Jenderal Sudirman No. 1, Balikpapan", Latitude: ptr(-1.265386), Longitude: ptr(116.831200), AllowedRadiusMeter: 180, GeofenceEnabled: true, IsActive: true},
		{Name: "Palembang Branch Office", Code: "PLM", Address: "Jl. Kapten A. Rivai No. 25, Palembang", Latitude: ptr(-2.976074), Longitude: ptr(104.749718), AllowedRadiusMeter: 130, GeofenceEnabled: true, IsActive: false},
		{Name: "Runtime Test Office", Code: "TEST_OFFICE", Address: "Test Street No. 1", Latitude: ptr(-6.360310), Longitude: ptr(106.832551), AllowedRadiusMeter: 1000, GeofenceEnabled: true, IsActive: true},
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
