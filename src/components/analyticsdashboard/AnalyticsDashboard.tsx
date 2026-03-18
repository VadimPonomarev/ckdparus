'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Grid,
  GridItem,
  Flex,
  Badge,
  VStack,
  HStack,
  Icon,
  Portal,
  createListCollection,
  Card,
  Stat,
  Progress,
  Select,
  Spinner,
  Center,
  Alert,
  Button,
} from '@chakra-ui/react';

// Интерфейсы для данных
interface DailyStat {
  date: Date;
  visits: number;
  unique_visitors: number;
}

interface PageStat {
  page: string;
  _count: {
    id: number;
  };
}

interface ReferrerStat {
  referrer: string | null;
  _count: {
    id: number;
  };
}

interface DeviceStat {
  deviceType: string | null;
  _count: {
    id: number;
  };
}

interface BrowserStat {
  browser: string | null;
  _count: {
    id: number;
  };
}

interface CountryStat {
  country: string | null;
  _count: {
    id: number;
  };
}

interface RecentActivity {
  page: string;
  country: string | null;
  deviceType: string | null;
  visitedAt: Date;
}

interface AnalyticsDashboardProps {
  dailyStats: DailyStat[];
  topPages: PageStat[];
  topReferrers: ReferrerStat[];
  deviceStats: DeviceStat[];
  browserStats: BrowserStat[];
  osStats: BrowserStat[];
  countryStats: CountryStat[];
  recentActivity: RecentActivity[];
  totalVisits: number;
  totalUnique: number;
}

// Создаем коллекцию для Select
const periodCollection = createListCollection({
  items: [
    { label: 'Последние 7 дней', value: '7' },
    { label: 'Последние 30 дней', value: '30' },
    { label: 'Последние 90 дней', value: '90' },
  ],
});

export default function AnalyticsDashboard(props: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Состояния для данных
  const [dailyStats, setDailyStats] = useState(props.dailyStats);
  const [topPages, setTopPages] = useState(props.topPages);
  const [topReferrers, setTopReferrers] = useState(props.topReferrers);
  const [deviceStats, setDeviceStats] = useState(props.deviceStats);
  const [browserStats, setBrowserStats] = useState(props.browserStats);
  const [osStats, setOsStats] = useState(props.osStats);
  const [countryStats, setCountryStats] = useState(props.countryStats);
  const [recentActivity, setRecentActivity] = useState(props.recentActivity);
  const [totalVisits, setTotalVisits] = useState(props.totalVisits);
  const [totalUnique, setTotalUnique] = useState(props.totalUnique);

  // Функция для загрузки данных
  const fetchAnalytics = async (days: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics?days=${days}`);

      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }

      const data = await response.json();

      // Обновляем все состояния
      setDailyStats(data.dailyStats || []);
      setTopPages(data.topPages || []);
      setTopReferrers(data.topReferrers || []);
      setDeviceStats(data.deviceStats || []);
      setBrowserStats(data.browserStats || []);
      setOsStats(data.osStats || []);
      setCountryStats(data.countryStats || []);
      setRecentActivity(data.recentActivity || []);
      setTotalVisits(data.totalVisits || 0);
      setTotalUnique(data.totalUnique || 0);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  // Загружаем данные при изменении периода
  useEffect(() => {
    fetchAnalytics(selectedPeriod);
  }, [selectedPeriod]);

  // Вычисляем среднее количество в день
  const avgDaily =
    dailyStats.length > 0
      ? Math.round(Number(totalVisits) / dailyStats.length)
      : 0;

  // Показываем загрузку
  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Center minH="400p">
            <VStack gap="4">
              <Spinner size="xl" color="blue.500" />
              <Text color="gray.600">Загрузка данных...</Text>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Center minH="400p">
            <VStack gap="4">
              <Alert.Root status="error" maxW="500p" borderRadius="lg">
                <Alert.Indicator />
                <Alert.Title>{error}</Alert.Title>
              </Alert.Root>
              <Button
                colorScheme="blue"
                onClick={() => fetchAnalytics(selectedPeriod)}
                mt={4}
              >
                Попробовать снова
              </Button>
            </VStack>
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" p={10}>
      {/* Шапка */}
      <Box
        as="header"
        borderBottom="1p"
        borderColor="gray.200"
        py={6}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading size="lg" color="gray.900">
              Аналитика посещаемости
            </Heading>

            <Select.Root
              collection={periodCollection}
              width="200p"
              value={[selectedPeriod]}
              onValueChange={e => setSelectedPeriod(e.value[0])}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Выберите период" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {periodCollection.items.map(period => (
                      <Select.Item item={period} key={period.value}>
                        {period.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>
        </Container>
      </Box>

      {/* Основной контент */}
      <Container maxW="container.xl" py={8} p={10}>
        <VStack align="stretch">
          {/* Карточки с метриками */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }}>
            <MetricCard
              title="Всего визитов"
              value={totalVisits.toLocaleString()}
              color="blue"
              helpText="за выбранный период"
            />
            <MetricCard
              title="Уникальные посетители"
              value={totalUnique.toLocaleString()}
              color="green"
              helpText="по session_id"
            />
            <MetricCard
              title="Среднее в день"
              value={avgDaily.toLocaleString()}
              color="purple"
              helpText="просмотров"
            />
            <MetricCard
              title="Стран"
              value={countryStats.length.toString()}
              color="orange"
              helpText="география посетителей"
            />
          </SimpleGrid>

          {/* График посещаемости */}
          <Card.Root variant="outline">
            <Card.Body>
              <Heading size="md" color="gray.900" mb={4}>
                Посещаемость по дням
              </Heading>
              <Box h="400p">
                {dailyStats.length > 0 ? (
                  <VisitsChart data={dailyStats} />
                ) : (
                  <Center h="100%">
                    <Text color="gray.500">Нет данных за выбранный период</Text>
                  </Center>
                )}
              </Box>
            </Card.Body>
          </Card.Root>

          {/* Две колонки: популярные страницы и источники */}
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <TopPagesTable pages={topPages} />
            </GridItem>
            <GridItem>
              <TopReferrersTable referrers={topReferrers} />
            </GridItem>
          </Grid>

          {/* Статистика по устройствам */}
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={6}>
            <GridItem>
              <DeviceStats deviceStats={deviceStats} />
            </GridItem>
            <GridItem>
              <BrowserStats browserStats={browserStats} title="Браузеры" />
            </GridItem>
            <GridItem>
              <BrowserStats
                browserStats={osStats}
                title="Операционные системы"
              />
            </GridItem>
          </Grid>

          {/* Страны и последние активности */}
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <CountryStats countryStats={countryStats} />
            </GridItem>
            <GridItem>
              <RecentActivity activities={recentActivity} />
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}

// Вспомогательные компоненты

function MetricCard({
  title,
  value,
  color,
  helpText,
}: {
  title: string;
  value: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  helpText: string;
}) {
  const colors = {
    blue: { bg: 'blue.50', color: 'blue.600', border: 'blue.100' },
    green: { bg: 'green.50', color: 'green.600', border: 'green.100' },
    purple: { bg: 'purple.50', color: 'purple.600', border: 'purple.100' },
    orange: { bg: 'orange.50', color: 'orange.600', border: 'orange.100' },
  };

  return (
    <Card.Root variant="outline" p={10}>
      <Card.Body>
        <Stat.Root>
          <Stat.Label color="gray.500" fontSize="sm">
            {title}
          </Stat.Label>
          <Stat.ValueText fontSize="3xl" fontWeight="bold" color="gray.900">
            {value}
          </Stat.ValueText>
          <Text fontSize="xs" color="gray.500">
            {helpText}
          </Text>
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
}

function VisitsChart({ data }: { data: DailyStat[] }) {
  const maxVisits = Math.max(...data.map(d => d.visits));

  return (
    <Flex h="100%" w="100%" align="flex-end" justify="space-between">
      {data
        .slice()
        .reverse()
        .map((day, index) => {
          const height = maxVisits > 0 ? (day.visits / maxVisits) * 100 : 0;
          return (
            <Box
              key={index}
              as="button"
              w="100%"
              maxW="40p"
              mx={1}
              position="relative"
              _hover={{ opacity: 0.8 }}
              title={`${day.visits} просмотров\n${new Date(day.date).toLocaleDateString()}`}
            >
              <Box
                h={`${height}%`}
                bg="blue.500"
                borderRadius="md"
                minH="4p"
                transition="height 0.2s"
              />
            </Box>
          );
        })}
    </Flex>
  );
}

function TopPagesTable({ pages }: { pages: PageStat[] }) {
  if (!pages.length) {
    return (
      <Card.Root variant="outline" p={10}>
        <Card.Body>
          <Heading size="md" color="gray.900" mb={4}>
            Популярные страницы
          </Heading>
          <Text color="gray.500">Нет данных</Text>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root variant="outline" p={10}>
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          Популярные страницы
        </Heading>
        <VStack align="stretch" gap={3}>
          {pages.map((page, index) => (
            <Flex key={index} align="center">
              <Text color="gray.500" w="8" fontSize="sm">
                {index + 1}.
              </Text>
              <Text flex="1" fontSize="sm" fontWeight="medium" color="gray.700">
                {page.page}
              </Text>
              <Badge colorScheme="blue" borderRadius="full" p={2}>
                {page._count.id}
              </Badge>
            </Flex>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

function TopReferrersTable({ referrers }: { referrers: ReferrerStat[] }) {
  if (!referrers.length) {
    return (
      <Card.Root variant="outline" p={10}>
        <Card.Body>
          <Heading size="md" color="gray.900" mb={4}>
            Источники трафика
          </Heading>
          <Text color="gray.500">Нет данных</Text>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root variant="outline" p={10}>
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          Источники трафика
        </Heading>
        <VStack align="stretch" gap={3}>
          {referrers.map((ref, index) => {
            let source = 'Прямой заход';
            if (ref.referrer) {
              try {
                source = new URL(ref.referrer).hostname;
              } catch {
                source = ref.referrer;
              }
            }

            return (
              <Flex key={index} align="center">
                <Text color="gray.500" w="8" fontSize="sm">
                  {index + 1}.
                </Text>
                <Text
                  flex="1"
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.700"
                >
                  {source}
                </Text>
                <Badge colorScheme="green" borderRadius="full" p={2}>
                  {ref._count.id}
                </Badge>
              </Flex>
            );
          })}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

function DeviceStats({ deviceStats }: { deviceStats: DeviceStat[] }) {
  if (!deviceStats.length) {
    return (
      <Card.Root variant="outline" p={10}>
        <Card.Body>
          <Heading size="md" color="gray.900" mb={4}>
            Устройства
          </Heading>
          <Text color="gray.500">Нет данных</Text>
        </Card.Body>
      </Card.Root>
    );
  }

  const total = deviceStats.reduce((acc, d) => acc + d._count.id, 0);

  return (
    <Card.Root variant="outline" p={10}>
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          Устройства
        </Heading>
        <VStack align="stretch" gap={4}>
          {deviceStats.map((device, index) => {
            const percentage = Math.round((device._count.id / total) * 100);
            return (
              <Box key={index}>
                <Flex justify="space-between" mb={1}>
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    textTransform="capitalize"
                  >
                    {device.deviceType || 'Неизвестно'}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    {device._count.id} ({percentage}%)
                  </Text>
                </Flex>
                <Progress.Root value={percentage} size="sm" maxW="100%">
                  <Progress.Track bg="gray.100">
                    <Progress.Range bg="blue.500" />
                  </Progress.Track>
                </Progress.Root>
              </Box>
            );
          })}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

function BrowserStats({
  browserStats,
  title,
}: {
  browserStats: BrowserStat[];
  title: string;
}) {
  if (!browserStats.length) {
    return (
      <Card.Root variant="outline" p={10}>
        <Card.Body>
          <Heading size="md" color="gray.900" mb={4}>
            {title}
          </Heading>
          <Text color="gray.500">Нет данных</Text>
        </Card.Body>
      </Card.Root>
    );
  }

  const total = browserStats.reduce((acc, b) => acc + b._count.id, 0);

  return (
    <Card.Root variant="outline" p={10}>
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          {title}
        </Heading>
        <VStack align="stretch" gap={4}>
          {browserStats.map((browser, index) => {
            const percentage = Math.round((browser._count.id / total) * 100);
            return (
              <Box key={index}>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="sm" color="gray.600">
                    {browser.browser || 'Неизвестно'}
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    {browser._count.id} ({percentage}%)
                  </Text>
                </Flex>
                <Progress.Root value={percentage} size="sm" maxW="100%">
                  <Progress.Track bg="gray.100">
                    <Progress.Range bg="green.500" />
                  </Progress.Track>
                </Progress.Root>
              </Box>
            );
          })}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

function CountryStats({ countryStats }: { countryStats: CountryStat[] }) {
  if (!countryStats.length) {
    return (
      <Card.Root variant="outline" p={10}>
        <Card.Body>
          <Heading size="md" color="gray.900" mb={4}>
            Страны
          </Heading>
          <Text color="gray.500">Нет данных</Text>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root variant="outline" p={10}>
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          Страны
        </Heading>
        <VStack align="stretch" gap={3}>
          {countryStats.map((country, index) => (
            <Flex key={index} align="center">
              <Text color="gray.500" w="8" fontSize="sm">
                {index + 1}.
              </Text>
              <Text flex="1" fontSize="sm" fontWeight="medium" color="gray.700">
                {country.country || 'Неизвестно'}
              </Text>
              <Badge colorScheme="orange" borderRadius="full" p={2}>
                {country._count.id}
              </Badge>
            </Flex>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

function RecentActivity({ activities }: { activities: RecentActivity[] }) {
  if (!activities.length) {
    return (
      <Card.Root variant="outline" p={10}>
        <Card.Body>
          <Heading size="md" color="gray.900" mb={4}>
            Последние активности
          </Heading>
          <Text color="gray.500">Нет данных</Text>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root variant="outline" p={10}>
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          Последние активности
        </Heading>
        <VStack align="stretch" gap={4}>
          {activities.map((activity, index) => (
            <Box key={index}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                {activity.page}
              </Text>
              <HStack gap={2} mt={1}>
                <Badge size="sm" colorScheme="gray">
                  {activity.country || 'Неизвестно'}
                </Badge>
                <Badge size="sm" colorScheme="gray">
                  {activity.deviceType || 'desktop'}
                </Badge>
                <Text fontSize="xs" color="gray.500">
                  {new Date(activity.visitedAt).toLocaleString()}
                </Text>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
