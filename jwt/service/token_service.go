package service

import (
	ijwt "github.com/madappgang/identifo/jwt"
	"github.com/madappgang/identifo/model"
)

const (
	// OfflineScope is a scope value to request refresh token.
	OfflineScope = "offline"
)

// TokenService is an abstract token manager.
type TokenService interface {
	NewAccessToken(u model.User, scopes []string, app model.AppData, requireTFA bool) (ijwt.Token, error)
	NewRefreshToken(u model.User, scopes []string, app model.AppData) (ijwt.Token, error)
	RefreshAccessToken(token ijwt.Token) (ijwt.Token, error)
	NewInviteToken() (ijwt.Token, error)
	NewResetToken(userID string) (ijwt.Token, error)
	NewWebCookieToken(u model.User) (ijwt.Token, error)
	Parse(string) (ijwt.Token, error)
	String(ijwt.Token) (string, error)
	Issuer() string
	Algorithm() string
	WebCookieTokenLifespan() int64
	PublicKey() interface{} // we are not using crypto.PublicKey here to avoid dependencies
	KeyID() string
}
