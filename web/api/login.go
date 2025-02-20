package api

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	jwtService "github.com/madappgang/identifo/jwt/service"
	"github.com/madappgang/identifo/model"
	"github.com/madappgang/identifo/web/authorization"
	"github.com/madappgang/identifo/web/middleware"
	"github.com/xlzd/gotp"
)

var (
	errPleaseEnableTFA  = fmt.Errorf("Please enable two-factor authentication to be able to use this app")
	errPleaseDisableTFA = fmt.Errorf("Please disable two-factor authentication to be able to use this app")
)

const (
	smsTFACode        = "%v is your one-time password!"
	hotpLifespanHours = 12 // One time code expiration in hours, default value is 30 secs for TOTP and 12 hours for HOTP
)

// AuthResponse is a response with successful auth data.
type AuthResponse struct {
	AccessToken  string     `json:"access_token,omitempty" bson:"access_token,omitempty"`
	RefreshToken string     `json:"refresh_token,omitempty" bson:"refresh_token,omitempty"`
	User         model.User `json:"user,omitempty" bson:"user,omitempty"`
}

type loginData struct {
	Username    string   `json:"username,omitempty"`
	Password    string   `json:"password,omitempty"`
	DeviceToken string   `json:"device_token,omitempty"`
	Scopes      []string `json:"scopes,omitempty"`
}

func (ld *loginData) validate() error {
	usernameLen := len(ld.Username)
	if usernameLen < 6 || usernameLen > 130 {
		return fmt.Errorf("Incorrect username length %d, expected a number between 6 and 130", usernameLen)
	}
	pswdLen := len(ld.Password)
	if pswdLen < 6 || pswdLen > 130 {
		return fmt.Errorf("Incorrect password length %d, expected a number between 6 and 130", pswdLen)
	}
	return nil
}

// LoginWithPassword logs user in with username and password.
func (ar *Router) LoginWithPassword() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !ar.SupportedLoginWays.Username {
			ar.Error(w, ErrorAPIAppLoginWithUsernameNotSupported, http.StatusBadRequest, "Application does not support login with username", "LoginWithPassword.supportedLoginWays")
			return
		}

		ld := loginData{}
		if ar.MustParseJSON(w, r, &ld) != nil {
			return
		}

		if err := ld.validate(); err != nil {
			ar.Error(w, ErrorAPIRequestBodyParamsInvalid, http.StatusBadRequest, err.Error(), "LoginWithPassword.validate")
			return
		}

		user, err := ar.userStorage.UserByNamePassword(ld.Username, ld.Password)
		if err != nil {
			ar.Error(w, ErrorAPIRequestIncorrectEmailOrPassword, http.StatusUnauthorized, err.Error(), "LoginWithPassword.UserByNamePassword")
			return
		}

		scopes, err := ar.userStorage.RequestScopes(user.ID(), ld.Scopes)
		if err != nil {
			ar.Error(w, ErrorAPIRequestScopesForbidden, http.StatusForbidden, err.Error(), "LoginWithPassword.RequestScopes")
			return
		}

		app := middleware.AppFromContext(r.Context())
		if app == nil {
			ar.logger.Println("Error getting App")
			ar.Error(w, ErrorAPIRequestAppIDInvalid, http.StatusBadRequest, "App is not in context.", "LoginWithPassword.AppFromContext")
			return
		}

		// Authorize user if the app requires authorization.
		azi := authorization.AuthzInfo{
			App:         app,
			UserRole:    user.AccessRole(),
			ResourceURI: r.RequestURI,
			Method:      r.Method,
		}
		if err := ar.Authorizer.Authorize(azi); err != nil {
			ar.Error(w, ErrorAPIAppAccessDenied, http.StatusForbidden, err.Error(), "LoginWithPassword.Authorizer")
			return
		}

		// Check if we should require user to authenticate with 2FA.
		require2FA, err := ar.check2FA(w, app.TFAStatus(), user.TFAInfo())
		if err != nil {
			return
		}

		offline := contains(scopes, jwtService.OfflineScope)
		accessToken, refreshToken, err := ar.loginUser(user, scopes, app, offline, require2FA)
		if err != nil {
			ar.Error(w, ErrorAPIAppAccessTokenNotCreated, http.StatusInternalServerError, err.Error(), "LoginWithPassword.loginUser")
			return
		}

		result := AuthResponse{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
		}

		if require2FA {
			if err := ar.sendOTPCode(user); err != nil {
				ar.Error(w, ErrorAPIRequestUnableToSendOTP, http.StatusInternalServerError, err.Error(), "LoginWithPassword.loginUser")
				return
			}
		} else {
			ar.userStorage.UpdateLoginMetadata(user.ID())
		}

		user.Sanitize()
		result.User = user
		ar.ServeJSON(w, http.StatusOK, result)
	}
}

func (ar *Router) sendOTPCode(user model.User) error {
	// we don't need to send any code for FTA Type App, it uses TOTP and generated on client side with the app
	if ar.tfaType != model.TFATypeApp {

		// increment hotp code seed
		otp := gotp.NewDefaultHOTP(user.TFAInfo().Secret).At(user.TFAInfo().HOTPCounter + 1)
		tfa := user.TFAInfo()
		tfa.HOTPCounter++
		tfa.HOTPExpiredAt = time.Now().Add(time.Hour * hotpLifespanHours)
		user.SetTFAInfo(tfa)
		if _, err := ar.userStorage.UpdateUser(user.ID(), user); err != nil {
			return err
		}
		switch ar.tfaType {
		case model.TFATypeSMS:
			return ar.sendTFACodeInSMS(user.Phone(), otp)
		case model.TFATypeEmail:
			return ar.sendTFACodeOnEmail(user.Email(), otp)
		}

	}

	return nil
}

// IsLoggedIn is for checking whether user is logged in or not.
// In fact, all needed work is done in Token middleware.
// If we reached this code, user is logged in (presented valid and not blacklisted access token).
func (ar *Router) IsLoggedIn() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ar.ServeJSON(w, http.StatusOK, nil)
	}
}

// loginUser creates and returns access token for a user.
// createRefreshToken boolean param tells if we should issue refresh token as well.
func (ar *Router) loginUser(user model.User, scopes []string, app model.AppData, createRefreshToken, require2FA bool) (accessTokenString, refreshTokenString string, err error) {
	token, err := ar.tokenService.NewAccessToken(user, scopes, app, require2FA)
	if err != nil {
		return
	}

	accessTokenString, err = ar.tokenService.String(token)
	if err != nil {
		return
	}
	if !createRefreshToken || require2FA {
		return
	}

	refresh, err := ar.tokenService.NewRefreshToken(user, scopes, app)
	if err != nil {
		return
	}
	refreshTokenString, err = ar.tokenService.String(refresh)
	if err != nil {
		return
	}
	return
}

// check2FA checks correspondence between app's TFAstatus and user's TFAInfo,
// and decides if we require two-factor authentication after all checks are successfully passed.
func (ar *Router) check2FA(w http.ResponseWriter, appTFAStatus model.TFAStatus, userTFAInfo model.TFAInfo) (bool, error) {
	if appTFAStatus == model.TFAStatusMandatory && !userTFAInfo.IsEnabled {
		ar.Error(w, ErrorAPIRequestPleaseEnableTFA, http.StatusBadRequest, errPleaseEnableTFA.Error(), "check2FA.mandatory")
		return false, errPleaseEnableTFA
	}

	if appTFAStatus == model.TFAStatusDisabled && userTFAInfo.IsEnabled {
		ar.Error(w, ErrorAPIRequestPleaseDisableTFA, http.StatusBadRequest, errPleaseDisableTFA.Error(), "check2FA.appDisabled_userEnabled")
		return false, errPleaseDisableTFA
	}

	// Request two-factor auth if user enabled it and app supports it.
	if userTFAInfo.IsEnabled && appTFAStatus != model.TFAStatusDisabled {
		if userTFAInfo.Secret == "" {
			// Then admin must have enabled TFA for this user manually.
			// User must obtain TFA secret, i.e send EnableTFA request.
			ar.Error(w, ErrorAPIRequestPleaseEnableTFA, http.StatusConflict, errPleaseEnableTFA.Error(), "check2FA.pleaseEnable")
			return false, errPleaseEnableTFA
		}
		return true, nil
	}
	return false, nil
}

func (ar *Router) sendTFACodeInSMS(phone, otp string) error {
	if phone == "" {
		return errors.New("unable to send SMS OTP, user has no phone number")
	}

	if err := ar.smsService.SendSMS(phone, fmt.Sprintf(smsTFACode, otp)); err != nil {
		return fmt.Errorf("Unable to send sms. %s", err)
	}
	return nil
}

func (ar *Router) sendTFACodeOnEmail(email, otp string) error {
	if email == "" {
		return errors.New("unable to send email OTP, user has no email")
	}

	if err := ar.emailService.SendTFAEmail("One-time password", email, otp); err != nil {
		return fmt.Errorf("Unable to send email with OTP with error: %s", err)
	}
	return nil
}
