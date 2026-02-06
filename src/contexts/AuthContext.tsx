'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем аутентификацию при загрузке
  useEffect(() => {
    const checkInitialAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const valid = await verifyToken(token);
        if (valid) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };

    checkInitialAuth();
  }, []);

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Ошибка входа',
        };
      }

      // Сохраняем токен
      localStorage.setItem('auth_token', data.token);
      setIsAuthenticated(true);

      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Ошибка подключения к серверу',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsAuthenticated(false);
      return false;
    }

    const valid = await verifyToken(token);
    if (!valid) {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      return false;
    }

    setIsAuthenticated(true);
    return true;
  };

  // Периодическая проверка токена
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      () => {
        checkAuth();
      },
      5 * 60 * 1000
    ); // Проверяем каждые 5 минут

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
