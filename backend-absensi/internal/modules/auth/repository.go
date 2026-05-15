package auth

import (
	"backend-absensi/internal/models"
	"gorm.io/gorm"
)

type Repository interface {
	FindByEmail(email string) (*models.User, error)
	FindByID(id string) (*models.User, error)
	CreateRefreshToken(token *models.RefreshToken) error
	FindRefreshToken(tokenHash string) (*models.RefreshToken, error)
	FindActiveRefreshTokens() ([]models.RefreshToken, error)
	RevokeRefreshToken(tokenHash string) error
	RevokeRefreshTokenByID(id string) error
	RevokeUserRefreshTokens(userID string) error
	UpdateUserLastLogin(userID string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ? AND is_active = ?", email, true).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) FindByID(id string) (*models.User, error) {
	var user models.User
	err := r.db.Where("id = ? AND is_active = ?", id, true).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) CreateRefreshToken(token *models.RefreshToken) error {
	return r.db.Create(token).Error
}

func (r *repository) FindRefreshToken(tokenHash string) (*models.RefreshToken, error) {
	var token models.RefreshToken
	err := r.db.Where("token_hash = ? AND revoked_at IS NULL", tokenHash).First(&token).Error
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func (r *repository) FindActiveRefreshTokens() ([]models.RefreshToken, error) {
	var tokens []models.RefreshToken
	err := r.db.
		Where("revoked_at IS NULL AND expires_at > NOW()").
		Find(&tokens).Error
	if err != nil {
		return nil, err
	}
	return tokens, nil
}

func (r *repository) RevokeRefreshToken(tokenHash string) error {
	return r.db.Model(&models.RefreshToken{}).
		Where("token_hash = ?", tokenHash).
		Update("revoked_at", gorm.Expr("NOW()")).Error
}

func (r *repository) RevokeRefreshTokenByID(id string) error {
	return r.db.Model(&models.RefreshToken{}).
		Where("id = ?", id).
		Update("revoked_at", gorm.Expr("NOW()")).Error
}

func (r *repository) RevokeUserRefreshTokens(userID string) error {
	return r.db.Model(&models.RefreshToken{}).
		Where("user_id = ? AND revoked_at IS NULL", userID).
		Update("revoked_at", gorm.Expr("NOW()")).Error
}

func (r *repository) UpdateUserLastLogin(userID string) error {
	return r.db.Model(&models.User{}).
		Where("id = ?", userID).
		Update("last_login_at", gorm.Expr("NOW()")).Error
}
