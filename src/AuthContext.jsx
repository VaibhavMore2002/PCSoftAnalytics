import { createContext, useContext, useState, useCallback } from 'react';
import { apiFetch, getAuthHeader, buildQuery } from './api.js';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = sessionStorage.getItem('pcsoft_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (username, password) => {
    const header = getAuthHeader(username, password);
    const user = await apiFetch('/api/v1/auth/login', { method: 'POST' }, header);
    const authData = { header, user };
    sessionStorage.setItem('pcsoft_auth', JSON.stringify(authData));
    setAuth(authData);
    return user;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('pcsoft_auth');
    setAuth(null);
  }, []);

  // Convenience wrapper that injects the auth header
  const api = useCallback(
    (path, options = {}, params = {}) => {
      const qs = buildQuery(params);
      return apiFetch(`${path}${qs}`, options, auth?.header);
    },
    [auth]
  );

  return (
    <AuthContext.Provider
      value={{
        auth,
        user: auth?.user,
        isAuthenticated: !!auth,
        login,
        logout,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
