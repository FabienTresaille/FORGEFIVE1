'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken } from './api';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse stored user:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === '/login' || pathname === '/change-password';
      if (!user && !isAuthPage) {
        router.push('/login');
      } else if (user && user.must_change_password && pathname !== '/change-password') {
        router.push('/change-password');
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    if (res.access_token) {
      setAuthToken(res.access_token);
      if (res.refresh_token) {
        localStorage.setItem('refresh_token', res.refresh_token);
      }
      
      // Decode or build minimal user object if not returned directly
      const userData = res.user || {
        email,
        must_change_password: res.must_change_password || false,
        role: res.role || 'user',
        display_name: res.display_name || email.split('@')[0]
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      if (userData.must_change_password) {
        router.push('/change-password');
      } else {
        router.push('/dashboard');
      }
      return res;
    }
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
