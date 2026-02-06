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
  Link,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push('/');
      router.refresh();
    } else {
      setError(result.message || 'Ошибка входа');
    }

    setLoading(false);
  };

  return (
    <Container maxW="md" py={20}>
      <Card.Root>
        <Card.Body p={8}>
          <Stack gap="6">
            <Heading size="xl" textAlign="center">
              Вход в систему
            </Heading>

            {error && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Title>{error}</Alert.Title>
              </Alert.Root>
            )}

            <form onSubmit={handleSubmit}>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>Email</Field.Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Введите ваш email"
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

            {/* <Box textAlign="center">
              <Text color="fg.muted">
                Нет аккаунта?{' '}
                <Link href="/register" colorPalette="blue">
                  Зарегистрироваться
                </Link>
              </Text>
            </Box> */}
          </Stack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}
