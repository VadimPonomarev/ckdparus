'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Card,
  Stack,
  Heading,
  Text,
  Button,
  Field,
  Input,
  Alert,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      router.push('/');
      router.refresh();
    } else {
      setError(result.message || 'Ошибка входа');
    }

    setLoading(false);
  };

  if (isLoading) {
    return (
      <Container maxW="md" py={20}>
        <Card.Root>
          <Card.Body p={8}>
            <Stack gap="6" alignItems="center">
              <Heading size="xl">Загрузка...</Heading>
            </Stack>
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
              Вход для администратора
            </Heading>

            <Text textAlign="center" color="fg.muted">
              Для доступа к административным функциям сайта
            </Text>

            {error && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Title>{error}</Alert.Title>
              </Alert.Root>
            )}

            <form onSubmit={handleSubmit}>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>Имя пользователя</Field.Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Введите имя пользователя"
                    required
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Пароль</Field.Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    required
                  />
                </Field.Root>

                <Button
                  type="submit"
                  colorPalette="blue"
                  loading={loading}
                  width="full"
                >
                  Войти
                </Button>
              </Stack>
            </form>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}
