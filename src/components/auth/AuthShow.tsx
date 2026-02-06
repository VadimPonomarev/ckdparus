'use client';

import { useAuth } from '@/contexts/AuthContext';

interface AuthShowProps {
  children: React.ReactNode;
  role?: string;
  fallback?: React.ReactNode;
}

export default function AuthShow({ children, role, fallback }: AuthShowProps) {
  const { user, hasRole } = useAuth();

  if (!user) {
    return fallback || null;
  }

  if (role && !hasRole(role)) {
    return fallback || null;
  }

  return <>{children}</>;
}
