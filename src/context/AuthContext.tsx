'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export interface User {
  id: number;
  email: string;
  userName: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected';
  kycVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function refreshUser(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      // Because our api.ts interceptor returns response.data,
      // 'res' here is the User object itself.
      const res = await api.get<User>('/users/me');
      const userData = (res as any).data || res;

      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Auth Refresh Failed:", error);
      setUser(null);
      localStorage.removeItem('token');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function login(token: string) {
    localStorage.setItem('token', token);
    // The api.ts interceptor will now pick this up automatically
    const u = await refreshUser();
    if (!u) return;
    router.push('/dashboard');
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    router.replace('/login');
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}