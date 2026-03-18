// app/admin/analytics/page.tsx
'use client';

import { useEffect, useState } from 'react';
import AnalyticsDashboard from '@/components/analyticsdashboard/AnalyticsDashboard';
import AuthGuard from '@/components/auth/AuthGuard';
import {
  Center,
  Spinner,
  VStack,
  Text,
  Alert,
  Container,
} from '@chakra-ui/react';

// Интерфейсы для данных аналитики (экспортируем для переиспользования)
export interface DailyStat {
  date: Date;
  visits: number;
  unique_visitors: number;
}

export interface PageStat {
  page: string;
  _count: {
    id: number;
  };
}

export interface ReferrerStat {
  referrer: string | null;
  _count: {
    id: number;
  };
}

export interface DeviceStat {
  deviceType: string | null;
  _count: {
    id: number;
  };
}

export interface BrowserStat {
  browser: string | null;
  _count: {
    id: number;
  };
}

export interface CountryStat {
  country: string | null;
  _count: {
    id: number;
  };
}

export interface RecentActivity {
  page: string;
  country: string | null;
  deviceType: string | null;
  visitedAt: Date;
}

// Интерфейс для ответа от API
interface AnalyticsData {
  totalVisits: number;
  totalUnique: number;
  dailyStats: DailyStat[];
  topPages: PageStat[];
  topReferrers: ReferrerStat[];
  deviceStats: DeviceStat[];
  browserStats: BrowserStat[];
  osStats: BrowserStat[];
  countryStats: CountryStat[];
  recentActivity: RecentActivity[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/analytics?days=30');

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Не авторизован');
          }
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка загрузки данных');
        }

        const analyticsData: AnalyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <AuthGuard>
        <Container maxW="container.xl" py={8}>
          <Center minH="400px">
            <VStack gap="4">
              <Spinner size="xl" color="blue.500" />
              <Text color="gray.600">Загрузка аналитики...</Text>
            </VStack>
          </Center>
        </Container>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <Container maxW="container.xl" py={8}>
          <Center minH="400px">
            <Alert.Root status="error" maxW="500px" borderRadius="lg">
              <Alert.Indicator />
              <Alert.Title>{error}</Alert.Title>
            </Alert.Root>
          </Center>
        </Container>
      </AuthGuard>
    );
  }

  if (!data) {
    return (
      <AuthGuard>
        <Container maxW="container.xl" py={8}>
          <Center minH="400px">
            <Alert.Root status="info" maxW="500px" borderRadius="lg">
              <Alert.Indicator />
              <Alert.Title>Данные не найдены</Alert.Title>
            </Alert.Root>
          </Center>
        </Container>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AnalyticsDashboard
        dailyStats={data.dailyStats}
        topPages={data.topPages}
        topReferrers={data.topReferrers}
        deviceStats={data.deviceStats}
        browserStats={data.browserStats}
        osStats={data.osStats}
        countryStats={data.countryStats}
        recentActivity={data.recentActivity}
        totalVisits={data.totalVisits}
        totalUnique={data.totalUnique}
      />
    </AuthGuard>
  );
}
