package main

import (
	"backend-absensi/internal/config"
	"backend-absensi/internal/database"
	"backend-absensi/internal/database/seeder"
	"log"
)

func main() {
	cfg := config.LoadConfig()
	database.ConnectDB(cfg)

	summary, err := seeder.Run(database.DB)
	if err != nil {
		log.Fatal("Seeder failed:", err)
	}

	seeder.LogSummary(summary)
}
