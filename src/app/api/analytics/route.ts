// app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Получаем параметры запроса
    const url = new URL(request.url);
    const days = url.searchParams.get('days') || '30';
    const daysNum = parseInt(days, 10);

    // Вычисляем дату начала периода
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    console.log('Start date:', startDate);

    // Сначала проверим, есть ли вообще данные в таблице
    const totalCount = await prisma.pageView.count();
    console.log('Total records in pageviews:', totalCount);

    const recentCount = await prisma.pageView.count({
      where: { visitedAt: { gte: startDate } },
    });
    console.log('Records in last', daysNum, 'days:', recentCount);

    // Получаем общую статистику
    const totalStats = await prisma.pageView.aggregate({
      _count: {
        id: true,
        sessionId: true,
      },
      where: { visitedAt: { gte: startDate } },
    });

    // Получаем статистику по дням с помощью группировки в Prisma, а не raw SQL
    const allPageViews = await prisma.pageView.findMany({
      where: { visitedAt: { gte: startDate } },
      select: {
        visitedAt: true,
        sessionId: true,
      },
      orderBy: {
        visitedAt: 'asc',
      },
    });

    // Группируем вручную на клиенте (для простоты)
    const dailyStatsMap = new Map();

    allPageViews.forEach(view => {
      const dateStr = view.visitedAt.toISOString().split('T')[0];
      if (!dailyStatsMap.has(dateStr)) {
        dailyStatsMap.set(dateStr, {
          date: dateStr,
          visits: 0,
          uniqueVisitors: new Set(),
        });
      }
      const dayStat = dailyStatsMap.get(dateStr);
      dayStat.visits++;
      dayStat.uniqueVisitors.add(view.sessionId);
    });

    const dailyStats = Array.from(dailyStatsMap.entries())
      .map(([date, stat]) => ({
        date: new Date(date),
        visits: stat.visits,
        unique_visitors: stat.uniqueVisitors.size,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    // Топ страниц
    const topPages = await prisma.pageView.groupBy({
      by: ['page'],
      _count: { id: true },
      where: { visitedAt: { gte: startDate } },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // Топ рефереров
    const topReferrers = await prisma.pageView.groupBy({
      by: ['referrer'],
      _count: { id: true },
      where: {
        visitedAt: { gte: startDate },
        referrer: { not: null },
      },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // Статистика по устройствам
    const deviceStats = await prisma.pageView.groupBy({
      by: ['deviceType'],
      _count: { id: true },
      where: {
        visitedAt: { gte: startDate },
        deviceType: { not: null },
      },
    });

    // Статистика по браузерам
    const browserStats = await prisma.pageView.groupBy({
      by: ['browser'],
      _count: { id: true },
      where: {
        visitedAt: { gte: startDate },
        browser: { not: null },
      },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    // Статистика по ОС
    const osStats = await prisma.pageView.groupBy({
      by: ['os'],
      _count: { id: true },
      where: {
        visitedAt: { gte: startDate },
        os: { not: null },
      },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    // Статистика по странам
    const countryStats = await prisma.pageView.groupBy({
      by: ['country'],
      _count: { id: true },
      where: {
        visitedAt: { gte: startDate },
        country: { not: null },
      },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    // Последние активности
    const recentActivity = await prisma.pageView.findMany({
      take: 10,
      orderBy: { visitedAt: 'desc' },
      select: {
        page: true,
        country: true,
        deviceType: true,
        visitedAt: true,
      },
    });

    // Формируем ответ
    const response = {
      totalVisits: totalStats._count.id,
      totalUnique: totalStats._count.sessionId,
      dailyStats,
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
    // Возвращаем более детальную информацию об ошибке
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
