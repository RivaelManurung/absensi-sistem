package seeder

import (
	"backend-absensi/internal/modules/rbac"
	"fmt"
	"log"

	"gorm.io/gorm"
)

const DefaultPassword = "password123"

type Result struct {
	Created int
	Skipped int
}

type Summary struct {
	Permissions Result
	Offices     Result
	Shifts      Result
	Employees   Result
	Attendances Result
}

func Run(db *gorm.DB) (*Summary, error) {
	summary := &Summary{}

	err := db.Transaction(func(tx *gorm.DB) error {
		var err error

		if err := rbac.SeedPermissions(tx); err != nil {
			return fmt.Errorf("seed permissions: %w", err)
		}
		summary.Permissions.Created = 1 // Simplified

		summary.Offices, err = seedOffices(tx)
		if err != nil {
			return fmt.Errorf("seed offices: %w", err)
		}

		summary.Shifts, err = seedShifts(tx)
		if err != nil {
			return fmt.Errorf("seed shifts: %w", err)
		}

		summary.Employees, err = seedEmployees(tx)
		if err != nil {
			return fmt.Errorf("seed employees: %w", err)
		}

		summary.Attendances, err = seedAttendances(tx)
		if err != nil {
			return fmt.Errorf("seed attendances: %w", err)
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return summary, nil
}

func LogSummary(summary *Summary) {
	log.Println("Seeder completed:")
	log.Printf("- Permissions: %d initialized", summary.Permissions.Created)
	log.Printf("- Offices: %d created / %d skipped", summary.Offices.Created, summary.Offices.Skipped)
	log.Printf("- Shifts: %d created / %d skipped", summary.Shifts.Created, summary.Shifts.Skipped)
	log.Printf("- Employees: %d created / %d skipped", summary.Employees.Created, summary.Employees.Skipped)
	log.Printf("- Attendances: %d created / %d skipped", summary.Attendances.Created, summary.Attendances.Skipped)
}
