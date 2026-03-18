import { prisma } from '@/lib/prisma';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

// Простая проверка авторизации через переменную окружения
async function checkAuth() {
  // В реальном проекте здесь должна быть проверка сессии
  // Например, через NextAuth.js или middleware
  return true; // временно разрешаем всем
}

export default async function AnalyticsPage() {
  // Проверяем авторизацию
  const isAuthorized = await checkAuth();

  if (!isAuthorized) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Доступ запрещен</h1>
        <p className="mt-2">У вас нет прав для просмотра этой страницы</p>
      </div>
    );
  }

  // Получаем данные за последние 30 дней
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

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
    // Общая статистика
    prisma.pageView.aggregate({
      _count: {
        id: true,
        sessionId: true,
      },
      where: { visitedAt: { gte: thirtyDaysAgo } },
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
      WHERE visited_at >= ${thirtyDaysAgo}
      GROUP BY DATE(visited_at)
      ORDER BY date DESC
    `,

    // Топ страниц
    prisma.pageView.groupBy({
      by: ['page'],
      _count: { id: true },
      where: { visitedAt: { gte: thirtyDaysAgo } },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),

    // Топ рефереров
    prisma.pageView.groupBy({
      by: ['referrer'],
      _count: { id: true },
      where: {
        visitedAt: { gte: thirtyDaysAgo },
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
        visitedAt: { gte: thirtyDaysAgo },
        deviceType: { not: null },
      },
    }),

    // Статистика по браузерам
    prisma.pageView.groupBy({
      by: ['browser'],
      _count: { id: true },
      where: {
        visitedAt: { gte: thirtyDaysAgo },
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
        visitedAt: { gte: thirtyDaysAgo },
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
        visitedAt: { gte: thirtyDaysAgo },
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

  return (
    <AnalyticsDashboard
      dailyStats={dailyStats}
      topPages={topPages}
      topReferrers={topReferrers}
      deviceStats={deviceStats}
      browserStats={browserStats}
      osStats={osStats}
      countryStats={countryStats}
      recentActivity={recentActivity}
      totalVisits={totalStats._count.id}
      totalUnique={totalStats._count.sessionId}
    />
  );
}
