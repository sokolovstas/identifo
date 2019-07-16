package admin

import (
	"net/http"
	"time"

	"github.com/urfave/negroni"
)

// Session is a middleware to check if admin is logged in with valid cookie.
// If all checks succeeded, prolongs existing session.
// If not, forces to login.
func (ar *Router) Session() negroni.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		if ar.isLoggedIn(w, r) {
			sessionID, err := ar.getSessionID(r)
			if err != nil {
				ar.Error(w, ErrorNotAuthorized, http.StatusUnauthorized, err.Error())
				return
			}
			ar.prolongSession(w, sessionID)
			next(w, r)
		}
	}
}

// IsLoggedIn checks if admin is logged in.
func (ar *Router) IsLoggedIn() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ar.isLoggedIn(w, r)
	}
}

func (ar *Router) isLoggedIn(w http.ResponseWriter, r *http.Request) bool {
	sessionID, err := ar.getSessionID(r)
	if err != nil {
		ar.Error(w, ErrorNotAuthorized, http.StatusUnauthorized, err.Error())
		return false
	}

	session, err := ar.sessionStorage.GetSession(sessionID)
	if err != nil {
		ar.Error(w, err, http.StatusUnauthorized, err.Error())
		return false
	}

	if time.Unix(session.ExpirationTime, 0).Before(time.Now()) {
		ar.Error(w, ErrorNotAuthorized, http.StatusUnauthorized, "")
		return false
	}

	return true
}

func (ar *Router) prolongSession(w http.ResponseWriter, sessionID string) {
	if err := ar.sessionService.ProlongSession(sessionID); err != nil {
		ar.logger.Println("Error prolonging session:", err)
		return
	}
	c := &http.Cookie{
		Name:     cookieName,
		Value:    encode(sessionID),
		Path:     "/",
		MaxAge:   ar.sessionService.SessionDurationSeconds(),
		HttpOnly: true,
	}
	http.SetCookie(w, c)
}

func (ar *Router) getSessionID(r *http.Request) (string, error) {
	cookie, err := r.Cookie(cookieName)
	if err != nil {
		return "", err
	}

	sessionID, err := decode(cookie.Value)
	return sessionID, err
}
