import { pause, getError } from '~/utils';

const createAuthService = ({ httpClient, apiUrl }) => {
  const login = async (email, password) => {
    const url = `${apiUrl}/login`;

    try {
      const response = await httpClient.post(url, { email, password });

      return response.data;
    } catch (err) {
      throw getError(err);
    }
  };

  const logout = () => {
    const url = `${apiUrl}/logout`;
    return httpClient.post(url);
  };

  const checkAuthState = () => {
    const url = `${apiUrl}/me`;

    return new Promise((resolve) => {
      httpClient.get(url)
        .then(() => pause(500))
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  };

  return Object.freeze({
    login, logout, checkAuthState,
  });
};

export default createAuthService;
