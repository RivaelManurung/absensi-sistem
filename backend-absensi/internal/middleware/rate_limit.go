package middleware

import (
	"backend-absensi/internal/pkg/response"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type rateLimitBucket struct {
	count       int
	windowStart time.Time
}

func RateLimitMiddleware(maxRequests int, window time.Duration) gin.HandlerFunc {
	var mu sync.Mutex
	buckets := make(map[string]*rateLimitBucket)

	return func(c *gin.Context) {
		if maxRequests <= 0 {
			c.Next()
			return
		}

		key := c.ClientIP() + ":" + c.FullPath()
		now := time.Now()

		mu.Lock()
		bucket, exists := buckets[key]
		if !exists || now.Sub(bucket.windowStart) >= window {
			bucket = &rateLimitBucket{count: 0, windowStart: now}
			buckets[key] = bucket
		}
		bucket.count++
		allowed := bucket.count <= maxRequests
		mu.Unlock()

		if !allowed {
			response.Error(c, http.StatusTooManyRequests, "Too many requests, please try again later", nil)
			c.Abort()
			return
		}

		c.Next()
	}
}
