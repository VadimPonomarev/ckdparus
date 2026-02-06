'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Spinner, Text, Center } from '@chakra-ui/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }

    if (!isLoading && user && requiredRole && !hasRole(requiredRole)) {
      router.push('/');
    }
  }, [user, isLoading, router, requiredRole, hasRole]);

  if (isLoading) {
    return (
      <Center minH="60vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" mb={4} />
          <Text color="gray.600">Проверка авторизации...</Text>
        </Box>
      </Center>
    );
  }

  if (!user) {
    return null; // Редирект произойдет в useEffect
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Center minH="60vh">
        <Box textAlign="center">
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            Доступ запрещен
          </Text>
          <Text color="gray.600">
            У вас недостаточно прав для просмотра этой страницы
          </Text>
        </Box>
      </Center>
    );
  }

  return <>{children}</>;
}
