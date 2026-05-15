package main

import (
	"backend-absensi/internal/config"
	"backend-absensi/internal/database"
	"backend-absensi/internal/routes"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()

	database.ConnectDB(cfg)

	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()
	routes.SetupRoutes(r, database.DB, cfg)

	// Route Debugging
	for _, route := range r.Routes() {
		log.Printf("Route: %s %s", route.Method, route.Path)
	}

	log.Printf("Server starting on port %s", cfg.AppPort)
	if err := r.Run(":" + cfg.AppPort); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
