package crypto

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
)

func GenerateRandomToken(length int) (string, error) {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func HashToken(token string, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(token))
	return hex.EncodeToString(h.Sum(nil))
}

func SecureCompare(hash1, hash2 string) bool {
	return hmac.Equal([]byte(hash1), []byte(hash2))
}

func GenerateOpaqueToken(prefix string, length int) (string, error) {
	randToken, err := GenerateRandomToken(length)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%s_%s", prefix, randToken), nil
}
