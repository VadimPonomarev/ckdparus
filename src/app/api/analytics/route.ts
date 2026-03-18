// app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Интерфейсы для типизации ответа
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

export async function GET(request: Request) {
  try {
    // Здесь можно добавить проверку авторизации
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Получаем параметры запроса (для фильтрации по датам)
    const url = new URL(request.url);
    const days = url.searchParams.get('days') || '30';
    const daysNum = parseInt(days, 10);

    // Вычисляем дату начала периода
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    // Параллельные запросы для оптимизации
    const [
      totalStats,
      dailyStats,
      topPages,
      topReferrers,
      deviceStats,
      browserStats,
      osStats,
      countryStats,
      recentActivity,
    ] = await Promise.all([
      // Общая статистика за период
      prisma.pageView.aggregate({
        _count: {
          id: true,
          sessionId: true,
        },
        where: { visitedAt: { gte: startDate } },
      }),

      // Статистика по дням
      prisma.$queryRaw<
        Array<{
          date: Date;
          visits: bigint;
          unique_visitors: bigint;
        }>
      >`
        SELECT 
          DATE(visited_at) as date,
          COUNT(*) as visits,
          COUNT(DISTINCT session_id) as unique_visitors
        FROM pageviews
        WHERE visited_at >= ${startDate}
        GROUP BY DATE(visited_at)
        ORDER BY date DESC
      `,

      // Топ страниц
      prisma.pageView.groupBy({
        by: ['page'],
        _count: { id: true },
        where: { visitedAt: { gte: startDate } },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),

      // Топ рефереров
      prisma.pageView.groupBy({
        by: ['referrer'],
        _count: { id: true },
        where: {
          visitedAt: { gte: startDate },
          referrer: { not: null },
        },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),

      // Статистика по устройствам
      prisma.pageView.groupBy({
        by: ['deviceType'],
        _count: { id: true },
        where: {
          visitedAt: { gte: startDate },
          deviceType: { not: null },
        },
      }),

      // Статистика по браузерам
      prisma.pageView.groupBy({
        by: ['browser'],
        _count: { id: true },
        where: {
          visitedAt: { gte: startDate },
          browser: { not: null },
        },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),

      // Статистика по ОС
      prisma.pageView.groupBy({
        by: ['os'],
        _count: { id: true },
        where: {
          visitedAt: { gte: startDate },
          os: { not: null },
        },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),

      // Статистика по странам
      prisma.pageView.groupBy({
        by: ['country'],
        _count: { id: true },
        where: {
          visitedAt: { gte: startDate },
          country: { not: null },
        },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),

      // Последние активности
      prisma.pageView.findMany({
        take: 10,
        orderBy: { visitedAt: 'desc' },
        select: {
          page: true,
          country: true,
          deviceType: true,
          visitedAt: true,
        },
      }),
    ]);

    // Преобразуем bigint в number для корректной сериализации в JSON
    const serializedDailyStats = dailyStats.map(stat => ({
      date: stat.date,
      visits: Number(stat.visits),
      unique_visitors: Number(stat.unique_visitors),
    }));

    // Формируем ответ
    const response = {
      totalVisits: totalStats._count.id,
      totalUnique: totalStats._count.sessionId,
      dailyStats: serializedDailyStats,
      topPages,
      topReferrers,
      deviceStats,
      browserStats,
      osStats,
      countryStats,
      recentActivity,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
