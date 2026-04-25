import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { api } from '../lib/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { user } = await api.get('/api/auth/me');
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      role: user?.role || null,

      async signIn(credentials) {
        const { user } = await api.post('/api/auth/login', credentials);
        setUser(user);
        return user;
      },
      async signUp(payload) {
        const { user } = await api.post('/api/auth/register', payload);
        setUser(user);
        return user;
      },
      async signOut() {
        await api.post('/api/auth/logout');
        setUser(null);
      },
      refresh,
    }),
    [user, loading, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
