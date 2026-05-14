package geolocation

import (
	"testing"
)

func TestDistanceMeters(t *testing.T) {
	// Monas, Jakarta
	lat1, lon1 := -6.175392, 106.827153
	// Sarinah, Jakarta (~1km away)
	lat2, lon2 := -6.187428, 106.823797

	dist := DistanceMeters(lat1, lon1, lat2, lon2)
	
	// Should be around 1300-1400 meters
	if dist < 1300 || dist > 1500 {
		t.Errorf("Expected distance between 1300 and 1500 meters, got %.2f", dist)
	}
}

func TestIsInsideRadius(t *testing.T) {
	if !IsInsideRadius(50, 100) {
		t.Error("50m should be inside 100m radius")
	}
	if IsInsideRadius(150, 100) {
		t.Error("150m should NOT be inside 100m radius")
	}
}

func TestIsValidCoordinate(t *testing.T) {
	if !IsValidCoordinate(0, 0) {
		t.Error("0,0 should be valid")
	}
	if IsValidCoordinate(91, 0) {
		t.Error("Lat 91 should be invalid")
	}
	if IsValidCoordinate(0, 181) {
		t.Error("Lon 181 should be invalid")
	}
}
