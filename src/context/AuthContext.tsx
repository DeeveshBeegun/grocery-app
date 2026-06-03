import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUser, UserRole } from '../types';
import { users } from '../data/mockData';

const STORAGE_KEY = '@app_user';

interface AuthContextValue {
  user: AppUser | null;
  isReady: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  updateProfile: (partial: Partial<AppUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setUser(JSON.parse(stored));
      } catch {
        // ignore
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const login = (role: UserRole) => {
    const found = users.find((u) => u.role === role) ?? users[0];
    setUser(found);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(found)).catch(() => {});
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  };

  const updateProfile = (partial: Partial<AppUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isReady, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
