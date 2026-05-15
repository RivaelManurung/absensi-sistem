package rbac

import (
	"backend-absensi/internal/models"
	"sync"

	"gorm.io/gorm"
)

type Service struct {
	db    *gorm.DB
	cache map[models.UserRole][]string
	mu    sync.RWMutex
}

func NewService(db *gorm.DB) *Service {
	s := &Service{
		db:    db,
		cache: make(map[models.UserRole][]string),
	}
	s.ReloadCache()
	return s
}

func (s *Service) ReloadCache() error {
	var rolePermissions []models.RolePermission
	if err := s.db.Preload("Permission").Find(&rolePermissions).Error; err != nil {
		return err
	}

	newCache := make(map[models.UserRole][]string)
	for _, rp := range rolePermissions {
		newCache[rp.Role] = append(newCache[rp.Role], rp.Permission.Name)
	}

	s.mu.Lock()
	s.cache = newCache
	s.mu.Unlock()

	return nil
}

func (s *Service) HasPermission(role models.UserRole, permission string) bool {
	// Super admin has all permissions
	if role == models.RoleSuperAdmin {
		return true
	}

	s.mu.RLock()
	defer s.mu.RUnlock()

	permissions, ok := s.cache[role]
	if !ok {
		return false
	}

	for _, p := range permissions {
		if p == permission {
			return true
		}
	}

	return false
}

func (s *Service) GetRolePermissions(role models.UserRole) []string {
	if role == models.RoleSuperAdmin {
		// Return all permissions (could be improved by fetching all from DB)
		return []string{"*"}
	}

	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.cache[role]
}
