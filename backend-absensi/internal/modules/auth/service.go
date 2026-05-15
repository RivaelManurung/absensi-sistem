package auth

import (
	"backend-absensi/internal/config"
	"backend-absensi/internal/models"
	"backend-absensi/internal/pkg/jwt"
	"backend-absensi/internal/pkg/password"
	"errors"
	"time"

	"github.com/google/uuid"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	AccessToken  string      `json:"access_token"`
	RefreshToken string      `json:"refresh_token"`
	User         models.User `json:"user"`
	Permissions  []string    `json:"permissions"`
}

type Service interface {
	Login(req LoginRequest) (*LoginResponse, error)
	RefreshToken(tokenStr string) (*LoginResponse, error)
	Logout(userID string) error
}

type service struct {
	repo Repository
	cfg  *config.Config
}

func NewService(repo Repository, cfg *config.Config) Service {
	return &service{repo, cfg}
}

func (s *service) Login(req LoginRequest) (*LoginResponse, error) {
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	if !password.Verify(req.Password, user.PasswordHash) {
		return nil, errors.New("invalid email or password")
	}

	accessToken, err := jwt.GenerateToken(user.ID.String(), user.Email, string(user.Role), s.cfg.JWTAccessSecret, s.cfg.JWTAccessExpiresMinutes)
	if err != nil {
		return nil, err
	}

	refreshTokenStr := uuid.New().String()
	refreshTokenHash, _ := password.Hash(refreshTokenStr)

	refreshToken := &models.RefreshToken{
		UserID:    user.ID,
		TokenHash: refreshTokenHash,
		ExpiresAt: time.Now().AddDate(0, 0, s.cfg.JWTRefreshExpiresDays),
	}

	if err := s.repo.CreateRefreshToken(refreshToken); err != nil {
		return nil, err
	}

	_ = s.repo.UpdateUserLastLogin(user.ID.String())

	return &LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshTokenStr,
		User:         *user,
	}, nil
}

func (s *service) RefreshToken(tokenStr string) (*LoginResponse, error) {
	tokens, err := s.repo.FindActiveRefreshTokens()
	if err != nil {
		return nil, err
	}

	for _, token := range tokens {
		if !password.Verify(tokenStr, token.TokenHash) {
			continue
		}

		user, err := s.repo.FindByID(token.UserID.String())
		if err != nil {
			return nil, errors.New("invalid refresh token")
		}

		accessToken, err := jwt.GenerateToken(user.ID.String(), user.Email, string(user.Role), s.cfg.JWTAccessSecret, s.cfg.JWTAccessExpiresMinutes)
		if err != nil {
			return nil, err
		}

		newRefreshTokenStr := uuid.New().String()
		newRefreshTokenHash, err := password.Hash(newRefreshTokenStr)
		if err != nil {
			return nil, err
		}

		if err := s.repo.RevokeRefreshTokenByID(token.ID.String()); err != nil {
			return nil, err
		}

		refreshToken := &models.RefreshToken{
			UserID:    user.ID,
			TokenHash: newRefreshTokenHash,
			ExpiresAt: time.Now().AddDate(0, 0, s.cfg.JWTRefreshExpiresDays),
		}
		if err := s.repo.CreateRefreshToken(refreshToken); err != nil {
			return nil, err
		}

		return &LoginResponse{
			AccessToken:  accessToken,
			RefreshToken: newRefreshTokenStr,
			User:         *user,
		}, nil
	}

	return nil, errors.New("invalid refresh token")
}

func (s *service) Logout(userID string) error {
	return s.repo.RevokeUserRefreshTokens(userID)
}
