package password

import (
	"testing"
)

func TestHashAndVerify(t *testing.T) {
	pass := "secret123"
	hash, err := Hash(pass)
	if err != nil {
		t.Fatalf("Failed to hash password: %v", err)
	}

	if !Verify(pass, hash) {
		t.Error("Verification failed for correct password")
	}

	if Verify("wrongpass", hash) {
		t.Error("Verification should fail for wrong password")
	}
}
