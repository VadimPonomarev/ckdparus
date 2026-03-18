'use client';

import { useState } from 'react';
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
  Icon,
  Portal,
  createListCollection,
  Card,
  Stat,
  Progress,
  Avatar,
  Select,
} from '@chakra-ui/react';

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

// Отдельный интерфейс для рефереров
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
  topReferrers: ReferrerStat[]; // Изменено на ReferrerStat
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
    { label: 'Последние 7 дней', value: '7days' },
    { label: 'Последние 30 дней', value: '30days' },
    { label: 'Последние 90 дней', value: '90days' },
  ],
});

export default function AnalyticsDashboard({
  dailyStats,
  topPages,
  topReferrers,
  deviceStats,
  browserStats,
  osStats,
  countryStats,
  recentActivity,
  totalVisits,
  totalUnique,
}: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  // Вычисляем среднее количество в день
  const avgDaily =
    dailyStats.length > 0
      ? Math.round(Number(totalVisits) / dailyStats.length)
      : 0;

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Шапка */}
      <Box
        as="header"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        py={6}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading size="lg" color="gray.900">
              Аналитика посещаемости
            </Heading>

            {/* Select.Root вместо Select */}
            <Select.Root
              collection={periodCollection}
              width="200px"
              value={[selectedPeriod]}
              onValueChange={e => setSelectedPeriod(e.value[0])}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger bg="white">
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
      <Container maxW="container.xl" py={8}>
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
          <Card.Root variant="outline" bg="white">
            <Card.Body>
              <Heading size="md" color="gray.900" mb={4}>
                Посещаемость по дням
              </Heading>
              <Box h="400px">
                <VisitsChart data={dailyStats} />
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
    blue: { bg: 'blue.50', color: 'blue.600' },
    green: { bg: 'green.50', color: 'green.600' },
    purple: { bg: 'purple.50', color: 'purple.600' },
    orange: { bg: 'orange.50', color: 'orange.600' },
  };

  return (
    <Card.Root variant="outline" bg="white">
      <Card.Body>
        <Flex justify="space-between" align="center">
          <Box>
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
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}

function VisitsChart({ data }: { data: DailyStat[] }) {
  const maxVisits = Math.max(...data.map(d => Number(d.visits)));

  return (
    <Flex h="100%" w="100%" align="flex-end" justify="space-between">
      {data
        .slice()
        .reverse()
        .map((day, index) => {
          const height =
            maxVisits > 0 ? (Number(day.visits) / maxVisits) * 100 : 0;
          return (
            <Box
              key={index}
              as="button"
              w="100%"
              maxW="40px"
              mx={1}
              position="relative"
              _hover={{ opacity: 0.8 }}
              title={`${Number(day.visits)} просмотров\n${new Date(day.date).toLocaleDateString()}`}
            >
              <Box
                h={`${height}%`}
                bg="blue.500"
                borderRadius="md"
                minH="4px"
                transition="height 0.2s"
              />
            </Box>
          );
        })}
    </Flex>
  );
}

function TopPagesTable({ pages }: { pages: PageStat[] }) {
  return (
    <Card.Root variant="outline" bg="white">
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          Популярные страницы
        </Heading>
        <VStack align="stretch">
          {pages.map((page, index) => (
            <Flex key={index} align="center">
              <Text color="gray.500" w="8" fontSize="sm">
                {index + 1}.
              </Text>
              <Text flex="1" fontSize="sm" fontWeight="medium" color="gray.700">
                {page.page}
              </Text>
              <Badge colorScheme="blue" borderRadius="full" px={2}>
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
  return (
    <Card.Root variant="outline" bg="white">
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          Источники трафика
        </Heading>
        <VStack align="stretch">
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
                <Badge colorScheme="green" borderRadius="full" px={2}>
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
  const total = deviceStats.reduce((acc, d) => acc + d._count.id, 0);

  return (
    <Card.Root variant="outline" bg="white">
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          Устройства
        </Heading>
        <VStack align="stretch">
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
  const total = browserStats.reduce((acc, b) => acc + b._count.id, 0);

  return (
    <Card.Root variant="outline" bg="white">
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          {title}
        </Heading>
        <VStack align="stretch">
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
  return (
    <Card.Root variant="outline" bg="white">
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          Страны
        </Heading>
        <VStack align="stretch">
          {countryStats.map((country, index) => (
            <Flex key={index} align="center">
              <Text color="gray.500" w="8" fontSize="sm">
                {index + 1}.
              </Text>
              <Text flex="1" fontSize="sm" fontWeight="medium" color="gray.700">
                {country.country || 'Неизвестно'}
              </Text>
              <Badge colorScheme="orange" borderRadius="full" px={2}>
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
  return (
    <Card.Root variant="outline" bg="white">
      <Card.Body>
        <Heading size="md" color="gray.900" mb={4}>
          Последние активности
        </Heading>
        <VStack align="stretch">
          {activities.map((activity, index) => (
            <Flex key={index} align="center" gap={3}>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  {activity.page}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {activity.country || 'Неизвестно'} •{' '}
                  {activity.deviceType || 'desktop'} •{' '}
                  {new Date(activity.visitedAt).toLocaleString()}
                </Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
