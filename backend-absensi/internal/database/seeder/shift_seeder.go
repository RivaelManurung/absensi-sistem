package seeder

import (
	"backend-absensi/internal/models"

	"gorm.io/gorm"
)

func seedShifts(tx *gorm.DB) (Result, error) {
	shifts := []models.Shift{
		{Name: "Regular", Code: "REGULAR", StartTime: "08:00", EndTime: "17:00", CheckInStart: "07:00", CheckInEnd: "09:00", CheckOutStart: "16:00", CheckOutEnd: "18:30", LateToleranceMinutes: 15, BreakDurationMinutes: 60, IsActive: true},
		{Name: "Morning", Code: "MORNING", StartTime: "06:00", EndTime: "14:00", CheckInStart: "05:15", CheckInEnd: "06:45", CheckOutStart: "13:30", CheckOutEnd: "15:00", LateToleranceMinutes: 10, BreakDurationMinutes: 45, IsActive: true},
		{Name: "Afternoon", Code: "AFTERNOON", StartTime: "14:00", EndTime: "22:00", CheckInStart: "13:15", CheckInEnd: "14:45", CheckOutStart: "21:30", CheckOutEnd: "23:00", LateToleranceMinutes: 10, BreakDurationMinutes: 45, IsActive: true},
		{Name: "Night", Code: "NIGHT", StartTime: "22:00", EndTime: "06:00", CheckInStart: "21:15", CheckInEnd: "22:45", CheckOutStart: "05:30", CheckOutEnd: "07:00", LateToleranceMinutes: 10, BreakDurationMinutes: 45, IsActive: true},
		{Name: "Flexible", Code: "FLEXIBLE", StartTime: "09:00", EndTime: "18:00", CheckInStart: "07:30", CheckInEnd: "10:30", CheckOutStart: "17:00", CheckOutEnd: "20:00", LateToleranceMinutes: 30, BreakDurationMinutes: 60, IsActive: true},
	}

	result := Result{}
	for _, shift := range shifts {
		var existing models.Shift
		err := tx.Where("code = ?", shift.Code).First(&existing).Error
		if err == nil {
			result.Skipped++
			continue
		}
		if err != gorm.ErrRecordNotFound {
			return result, err
		}
		if err := tx.Create(&shift).Error; err != nil {
			return result, err
		}
		result.Created++
	}

	return result, nil
}
