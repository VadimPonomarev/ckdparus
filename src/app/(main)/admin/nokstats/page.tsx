// app/admin/nok-stats/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Heading,
  Stack,
  Card,
  CardBody,
  CardHeader,
  Text,
  Grid,
  SimpleGrid,
  Box,
  VStack,
  HStack,
  Separator,
  Spinner,
} from '@chakra-ui/react';

interface Stats {
  totalResponses: number;
  ageDistribution: Record<string, number>;
  q1: Record<string, number>;
  q2: Record<string, number>;
  q3: Record<string, number>;
  q4: Record<string, number>;
  q5: Record<string, number>;
  q6: Record<string, number>;
  q7: Record<string, number>;
  q8: Record<string, number>;
  q9: Record<string, number>;
  q10: Record<string, number>;
  q11: Record<string, number>;
  q12: Record<string, number>;
  q13: Record<string, number>;
  q14: Record<string, number>;
}

const questionTitles = {
  q1: 'Комфортность условий пребывания',
  q2: 'Доброжелательность персонала',
  q3: 'График работы',
  q4: 'Информация на стендах и вывесках',
  q5: 'Информация на сайте',
  q6: 'Электронные сервисы',
  q7: 'Дополнительные услуги',
  q8: 'Полиграфические материалы',
  q9: 'Соблюдение времени предоставления услуг',
  q10: 'Нарушение режима работы сотрудниками',
  q11: 'Компетентность персонала',
  q12: 'Материально-техническое обеспечение',
  q13: 'Удовлетворенность условиями услуг',
  q14: 'Готовность рекомендовать',
};

export default function NokStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/nok');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container py={8} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Загрузка статистики...</Text>
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container py={8}>
        <Text>Нет данных для отображения</Text>
      </Container>
    );
  }

  const getProgressValue = (count: number, total: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  const renderQuestionStats = (
    questionKey: keyof typeof questionTitles,
    data: Record<string, number>
  ) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);

    return (
      <Card.Root key={questionKey} mb={4}>
        <CardHeader>
          <Heading size="sm">{questionTitles[questionKey]}</Heading>
        </CardHeader>
        <CardBody>
          <Stack gap={3}>
            {Object.entries(data).map(([option, count]) => (
              <Box key={option}>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="sm">{option}</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {count} ({((count / total) * 100).toFixed(1)}%)
                  </Text>
                </HStack>
                <Box bg="gray.200" borderRadius="full" h="2" overflow="hidden">
                  <Box
                    bg="teal.500"
                    width={`${getProgressValue(count, total)}%`}
                    h="full"
                    borderRadius="full"
                    transition="width 0.3s ease"
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </CardBody>
      </Card.Root>
    );
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Статистика опроса НОК</Heading>
          <Text color="gray.600" mt={2}>
            Результаты независимой оценки качества услуг
          </Text>
        </Box>

        <Separator />

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          <Card.Root>
            <CardBody textAlign="center">
              <Stack gap={1}>
                <Text fontSize="sm" color="gray.600">
                  Всего участников
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color="teal.600">
                  {stats.totalResponses}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  опрошено человек
                </Text>
              </Stack>
            </CardBody>
          </Card.Root>

          <Card.Root>
            <CardBody>
              <Stack gap={2}>
                <Text fontSize="sm" color="gray.600">
                  Возрастное распределение
                </Text>
                <Stack gap={2} mt={2}>
                  {Object.entries(stats.ageDistribution).map(([age, count]) => (
                    <HStack key={age} justify="space-between">
                      <Text fontSize="sm">{age}</Text>
                      <Text fontSize="sm" fontWeight="bold">
                        {count}
                      </Text>
                    </HStack>
                  ))}
                </Stack>
              </Stack>
            </CardBody>
          </Card.Root>

          <Card.Root>
            <CardBody>
              <Stack gap={2}>
                <Text fontSize="sm" color="gray.600">
                  Общая оценка
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color="teal.600">
                  {stats.q13 && stats.q13['Полностью удовлетворен']
                    ? (
                        (stats.q13['Полностью удовлетворен'] /
                          stats.totalResponses) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </Text>
                <Text fontSize="sm" color="gray.500">
                  полностью удовлетворены
                </Text>
              </Stack>
            </CardBody>
          </Card.Root>
        </SimpleGrid>

        <Separator />

        <Heading size="lg" mt={4}>
          Детальная статистика по вопросам
        </Heading>

        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          {Object.entries(questionTitles).map(([key]) => {
            const data = stats[key as keyof typeof questionTitles];
            if (data && typeof data === 'object') {
              return renderQuestionStats(
                key as keyof typeof questionTitles,
                data
              );
            }
            return null;
          })}
        </Grid>
      </VStack>
    </Container>
  );
}
