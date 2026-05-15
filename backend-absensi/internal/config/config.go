package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	AppName                      string
	AppEnv                       string
	AppPort                      string
	DBHost                       string
	DBPort                       string
	DBUser                       string
	DBPassword                   string
	DBName                       string
	JWTAccessSecret              string
	JWTRefreshSecret             string
	JWTAccessExpiresMinutes      int
	JWTRefreshExpiresDays        int
	MaxLocationAccuracy          float64
	CORSAllowedOrigins           string
	LoginRateLimitPerMinute      int
	AttendanceRateLimitPerMinute int
	QRSecret                     string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	return &Config{
		AppName:                      getEnv("APP_NAME", "absensi"),
		AppEnv:                       getEnv("APP_ENV", "development"),
		AppPort:                      getEnv("APP_PORT", "8080"),
		DBHost:                       getEnv("DB_HOST", "localhost"),
		DBPort:                       getEnv("DB_PORT", "5432"),
		DBUser:                       getEnv("DB_USER", "postgres"),
		DBPassword:                   getEnv("DB_PASSWORD", "postgres"),
		DBName:                       getEnv("DB_NAME", "absensi"),
		JWTAccessSecret:              getEnv("JWT_ACCESS_SECRET", "access-secret"),
		JWTRefreshSecret:             getEnv("JWT_REFRESH_SECRET", "refresh-secret"),
		JWTAccessExpiresMinutes:      getEnvInt("JWT_ACCESS_EXPIRES_MINUTES", 15),
		JWTRefreshExpiresDays:        getEnvInt("JWT_REFRESH_EXPIRES_DAYS", 7),
		MaxLocationAccuracy:          getEnvFloat("MAX_LOCATION_ACCURACY", 50.0),
		CORSAllowedOrigins:           getEnv("CORS_ALLOWED_ORIGINS", "*"),
		LoginRateLimitPerMinute:      getEnvInt("LOGIN_RATE_LIMIT_PER_MINUTE", 5),
		AttendanceRateLimitPerMinute: getEnvInt("ATTENDANCE_RATE_LIMIT_PER_MINUTE", 10),
		QRSecret:                     getEnv("QR_SECRET", "qr-secret-change-me"),
	}
}

func getEnvInt(key string, fallback int) int {
	if value, ok := os.LookupEnv(key); ok {
		if i, err := strconv.Atoi(value); err == nil {
			return i
		}
	}
	return fallback
}

func getEnvFloat(key string, fallback float64) float64 {
	if value, ok := os.LookupEnv(key); ok {
		if f, err := strconv.ParseFloat(value, 64); err == nil {
			return f
		}
	}
	return fallback
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
