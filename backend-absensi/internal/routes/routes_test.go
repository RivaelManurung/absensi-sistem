package routes

import (
	"backend-absensi/internal/config"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestQRRouteRegistration(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	cfg := &config.Config{
		QRSecret: "testsecret",
	}

	SetupRoutes(r, db, cfg)

	// Check if the route is registered
	found := false
	for _, route := range r.Routes() {
		if route.Method == "POST" && route.Path == "/api/v1/admin/offices/:officeId/qr-sessions" {
			found = true
			break
		}
	}

	assert.True(t, found, "Route POST /api/v1/admin/offices/:officeId/qr-sessions should be registered")
}
