package seeder

import (
	"backend-absensi/internal/models"
	"math"
	"time"

	"gorm.io/gorm"
)

func seedAttendances(tx *gorm.DB) (Result, error) {
	var employees []models.Employee
	if err := tx.Preload("Office").Preload("Shift").Where("is_active = ?", true).Order("employee_code asc").Limit(50).Find(&employees).Error; err != nil {
		return Result{}, err
	}

	result := Result{}
	now := time.Now()
	targetRecords := 120

	for i, employee := range employees {
		for dayOffset := 1; dayOffset <= 4 && result.Created < targetRecords; dayOffset++ {
			date := dateOnly(now.AddDate(0, 0, -dayOffset))

			var existing models.Attendance
			err := tx.Where("employee_id = ? AND attendance_date = ?", employee.ID, date).First(&existing).Error
			if err == nil {
				result.Skipped++
				continue
			}
			if err != gorm.ErrRecordNotFound {
				return result, err
			}

			attendance := buildAttendance(employee, date, i+dayOffset)
			if err := tx.Create(&attendance).Error; err != nil {
				return result, err
			}
			result.Created++
		}
	}

	return result, nil
}

func buildAttendance(employee models.Employee, date time.Time, seed int) models.Attendance {
	statuses := []models.AttendanceStatus{
		models.StatusCheckedOut,
		models.StatusPresent,
		models.StatusLate,
		models.StatusAbsent,
		models.StatusCheckedIn,
	}
	status := statuses[seed%len(statuses)]

	attendance := models.Attendance{
		EmployeeID:     employee.ID,
		OfficeID:       employee.OfficeID,
		ShiftID:        employee.ShiftID,
		AttendanceDate: date,
		Status:         status,
	}
	if status == models.StatusAbsent {
		attendance.Notes = "Tidak hadir - data seeder"
		return attendance
	}

	checkInAt := combineDateTime(date, employee.Shift.StartTime)
	lateMinutes := 0
	if status == models.StatusLate {
		lateMinutes = employee.Shift.LateToleranceMinutes + 5 + seed%20
		checkInAt = checkInAt.Add(time.Duration(lateMinutes) * time.Minute)
	} else {
		checkInAt = checkInAt.Add(-time.Duration(5+seed%20) * time.Minute)
	}

	lat, lon := nearbyCoordinate(employee.Office.Latitude, employee.Office.Longitude, seed)
	accuracy := 8.0 + float64(seed%12)
	distance := 15.0 + float64(seed%35)

	attendance.CheckInAt = &checkInAt
	attendance.CheckInLatitude = &lat
	attendance.CheckInLongitude = &lon
	attendance.CheckInAccuracy = &accuracy
	attendance.CheckInDistanceMeter = &distance
	attendance.LateMinutes = lateMinutes

	if status == models.StatusCheckedOut || status == models.StatusPresent || status == models.StatusLate {
		checkOutAt := combineDateTime(date, employee.Shift.EndTime)
		if isNightShift(employee.Shift.StartTime, employee.Shift.EndTime) {
			checkOutAt = checkOutAt.AddDate(0, 0, 1)
		}
		checkOutAt = checkOutAt.Add(time.Duration(seed%25) * time.Minute)
		outLat, outLon := nearbyCoordinate(employee.Office.Latitude, employee.Office.Longitude, seed+7)
		outAccuracy := accuracy + 2
		outDistance := math.Min(distance+5, float64(employee.Office.AllowedRadiusMeter-5))

		attendance.CheckOutAt = &checkOutAt
		attendance.CheckOutLatitude = &outLat
		attendance.CheckOutLongitude = &outLon
		attendance.CheckOutAccuracy = &outAccuracy
		attendance.CheckOutDistanceMeter = &outDistance
		if status == models.StatusPresent || status == models.StatusLate {
			attendance.Notes = "Kehadiran lengkap - data seeder"
		}
	}

	return attendance
}

func dateOnly(t time.Time) time.Time {
	y, m, d := t.Date()
	return time.Date(y, m, d, 0, 0, 0, 0, t.Location())
}

func combineDateTime(date time.Time, hhmm string) time.Time {
	parsed, err := time.ParseInLocation("2006-01-02 15:04", date.Format("2006-01-02")+" "+hhmm, date.Location())
	if err != nil {
		return date
	}
	return parsed
}

func isNightShift(start, end string) bool {
	return end <= start
}

func nearbyCoordinate(lat, lon float64, seed int) (float64, float64) {
	offsetLat := (float64(seed%9) - 4) * 0.000045
	offsetLon := (float64(seed%7) - 3) * 0.000045
	return lat + offsetLat, lon + offsetLon
}
