// app/admin/logout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  Stack,
  Heading,
  Text,
  Button,
  Alert,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

export default function LogoutPage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isLoggingOut && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isLoggingOut && countdown === 0) {
      router.push('/');
    }
  }, [isLoggingOut, countdown, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError('');

    try {
      await logout();
    } catch (err) {
      setError('Ошибка при выходе из системы. Попробуйте еще раз.');
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoggingOut) {
    return (
      <Container maxW="md" py={20}>
        <Card.Root>
          <Card.Body p={8}>
            <Center flexDirection="column" gap="6">
              <Spinner size="xl" colorPalette="blue" />
              <Heading size="md">Выход из системы...</Heading>
              <Text>Перенаправление через {countdown} секунд</Text>
            </Center>
          </Card.Body>
        </Card.Root>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={20}>
      <Card.Root>
        <Card.Body p={8}>
          <Stack gap="6">
            <Heading size="xl" textAlign="center">
              Выход из системы
            </Heading>

            {error && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Title>{error}</Alert.Title>
              </Alert.Root>
            )}

            <Text textAlign="center" fontSize="lg">
              Вы уверены, что хотите выйти?
            </Text>

            {user && (
              <Text textAlign="center" color="fg.muted" fontSize="sm">
                Пользователь: {user.username}
              </Text>
            )}

            <Stack gap="3" direction="row" justifyContent="center">
              <Button
                variant="outline"
                onClick={handleCancel}
                flex={1}
              >
                Отмена
              </Button>
              <Button
                colorPalette="red"
                onClick={handleLogout}
                flex={1}
              >
                Выйти
              </Button>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}