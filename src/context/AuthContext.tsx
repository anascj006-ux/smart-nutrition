import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize from storage or fetch demo user
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('smart_nutrition_token');
        const res = await fetch('/api/auth/me', {
          headers: storedToken ? { 'x-user-id': storedToken } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setToken(storedToken || data.user.id);
          }
        }
      } catch (err) {
        console.warn('Could not auto-fetch user session:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email?: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || 'demo@smartnutrition.ai', password: password || 'password123' }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token || data.user.id);
        localStorage.setItem('smart_nutrition_token', data.token || data.user.id);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token || data.user.id);
        localStorage.setItem('smart_nutrition_token', data.token || data.user.id);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Register error:', e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smart_nutrition_token');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
