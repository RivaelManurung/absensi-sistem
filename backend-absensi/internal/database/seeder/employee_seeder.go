package seeder

import (
	"backend-absensi/internal/models"
	"backend-absensi/internal/pkg/password"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type employeeSeed struct {
	Code       string
	Name       string
	Email      string
	Phone      string
	Position   string
	Department string
	Role       models.UserRole
	OfficeCode string
	ShiftCode  string
	IsActive   bool
}

func seedEmployees(tx *gorm.DB) (Result, error) {
	officeIDs, err := officeIDByCode(tx)
	if err != nil {
		return Result{}, err
	}
	shiftIDs, err := shiftIDByCode(tx)
	if err != nil {
		return Result{}, err
	}
	hash, err := password.Hash(DefaultPassword)
	if err != nil {
		return Result{}, err
	}

	result := Result{}
	for _, item := range employeeSeeds() {
		// 1. First, find or create the User
		var user models.User
		err = tx.Where("email = ?", item.Email).First(&user).Error
		
		switch err {
		case nil:
			// User exists, check if role needs update
			if user.Role != item.Role {
				if err := tx.Model(&user).Update("role", item.Role).Error; err != nil {
					return result, err
				}
			}
		case gorm.ErrRecordNotFound:
			// User doesn't exist, create it
			user = models.User{
				Name:         item.Name,
				Email:        item.Email,
				PasswordHash: hash,
				Role:         item.Role,
				IsActive:     item.IsActive,
			}
			if err := tx.Create(&user).Error; err != nil {
				return result, err
			}
		default:
			return result, err
		}

		// 2. Then, find or create the Employee
		var existingEmployee models.Employee
		err := tx.Where("employee_code = ?", item.Code).First(&existingEmployee).Error
		if err == nil {
			// Employee exists, check for updates if needed (e.g. name/position)
			// For now just skip as per previous logic, but role was already updated above
			result.Skipped++
			continue
		}
		if err != gorm.ErrRecordNotFound {
			return result, err
		}

		officeID, ok := officeIDs[item.OfficeCode]
		if !ok {
			return result, fmt.Errorf("office code %s not found", item.OfficeCode)
		}
		shiftID, ok := shiftIDs[item.ShiftCode]
		if !ok {
			return result, fmt.Errorf("shift code %s not found", item.ShiftCode)
		}

		employee := models.Employee{
			UserID:       user.ID,
			EmployeeCode: item.Code,
			FullName:     item.Name,
			Phone:        item.Phone,
			Position:     item.Position,
			Department:   item.Department,
			OfficeID:     officeID,
			ShiftID:      shiftID,
			DeviceID:     fmt.Sprintf("device-%s", item.Code),
			IsActive:     item.IsActive,
		}
		if err := tx.Create(&employee).Error; err != nil {
			return result, err
		}
		result.Created++
	}

	return result, nil
}

func officeIDByCode(tx *gorm.DB) (map[string]uuid.UUID, error) {
	var offices []models.Office
	if err := tx.Where("code <> ''").Find(&offices).Error; err != nil {
		return nil, err
	}
	items := make(map[string]uuid.UUID, len(offices))
	for _, office := range offices {
		items[office.Code] = office.ID
	}
	return items, nil
}

func shiftIDByCode(tx *gorm.DB) (map[string]uuid.UUID, error) {
	var shifts []models.Shift
	if err := tx.Where("code <> ''").Find(&shifts).Error; err != nil {
		return nil, err
	}
	items := make(map[string]uuid.UUID, len(shifts))
	for _, shift := range shifts {
		items[shift.Code] = shift.ID
	}
	return items, nil
}

func employeeSeeds() []employeeSeed {
	names := []string{
		"Andi Pratama", "Siti Rahmawati", "Budi Santoso", "Dewi Lestari", "Rizky Maulana",
		"Maya Putri", "Agus Setiawan", "Nadia Kirana", "Fajar Nugroho", "Intan Permata",
		"Ahmad Fauzi", "Rina Wulandari", "Hendra Saputra", "Fitri Amelia", "Yoga Prasetyo",
		"Ratna Sari", "Dimas Wijaya", "Laras Ayuningtyas", "Teguh Haryanto", "Citra Maharani",
		"Arif Firmansyah", "Niken Puspita", "Bayu Aditya", "Mega Pertiwi", "Rangga Mahendra",
		"Putri Anggraini", "Eko Wahyudi", "Anisa Kartika", "Galih Ramadhan", "Tiara Febriani",
		"Reza Kurniawan", "Vina Oktaviani", "Iqbal Hakim", "Ayu Safitri", "Farhan Akbar",
		"Melati Handayani", "Wahyu Saputra", "Rosa Damayanti", "Kevin Gunawan", "Dian Purnama",
		"Yusuf Hidayat", "Selvi Natalia", "Gilang Pratama", "Nabila Zahra", "Rafi Alamsyah",
		"Monica Larasati", "Ilham Maulana", "Sarah Maharani", "Taufik Iskandar", "Clara Aprilia",
		"Runtime Test User",
	}
	officeCodes := []string{"JKT", "BDG", "SBY", "MDN", "SMG", "YGY", "DPS", "MKS", "BPN", "PLM", "TEST_OFFICE"}
	shiftCodes := []string{"REGULAR", "MORNING", "AFTERNOON", "NIGHT", "FLEXIBLE", "TEST_RUNTIME"}
	departments := []string{"Engineering", "People Operations", "Finance", "Sales", "Operations", "Customer Success", "Product", "Legal"}
	positions := []string{"Backend Engineer", "HR Specialist", "Account Executive", "Operations Analyst", "Product Associate", "Finance Officer", "Support Lead", "QA Engineer"}

	items := make([]employeeSeed, 0, len(names))
	for i, name := range names {
		number := i + 1
		role := models.RoleEmployee
		position := positions[i%len(positions)]
		department := departments[i%len(departments)]
		email := fmt.Sprintf("employee%03d@example.com", number)

		if number <= 2 {
			role = models.RoleAdmin
			position = "System Administrator"
			department = "IT Administration"
		} else if number <= 7 {
			role = models.RoleHR
			position = "HR Business Partner"
			department = "People Operations"
		}
		if number == 1 {
			email = "admin@example.com"
			role = models.RoleSuperAdmin
		}
		if number == 3 {
			email = "hr@example.com"
		}
		if name == "Runtime Test User" {
			email = "attendance.test@example.com"
			role = models.RoleEmployee
			position = "Runtime Tester"
			department = "QA"
		}

		item := employeeSeed{
			Code:       fmt.Sprintf("EMP%03d", number),
			Name:       name,
			Email:      email,
			Phone:      fmt.Sprintf("+62812%08d", 70000000+number),
			Position:   position,
			Department: department,
			Role:       role,
			OfficeCode: officeCodes[i%len(officeCodes)],
			ShiftCode:  shiftCodes[i%len(shiftCodes)],
			IsActive:   number%17 != 0,
		}

		if name == "Runtime Test User" {
			item.OfficeCode = "TEST_OFFICE"
			item.ShiftCode = "TEST_RUNTIME"
			item.IsActive = true
		}

		items = append(items, item)
	}
	return items
}
