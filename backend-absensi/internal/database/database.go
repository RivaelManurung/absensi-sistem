package database

import (
	"backend-absensi/internal/config"
	"backend-absensi/internal/models"
	"fmt"
	"log"

	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB(cfg *config.Config) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort)

	var db *gorm.DB
	var err error
	const maxRetries = 5
	for i := 0; i < maxRetries; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("Failed to connect to database (attempt %d/%d): %v", i+1, maxRetries, err)
		if i < maxRetries-1 {
			log.Println("Retrying in 2 seconds...")
			time.Sleep(2 * time.Second)
		}
	}

	if err != nil {
		log.Fatal("Failed to connect to database after several attempts:", err)
	}

	// Auto Migration
	err = db.AutoMigrate(
		&models.User{},
		&models.Office{},
		&models.Shift{},
		&models.Employee{},
		&models.Attendance{},
		&models.AttendanceLog{},
		&models.RefreshToken{},
		&models.Permission{},
		&models.RolePermission{},
		&models.EmployeeQRCode{},
		&models.QRAttendanceSession{},
		&models.QRAttendanceScan{},
		&models.AuditLog{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database connected and migrated successfully")
	DB = db
}
