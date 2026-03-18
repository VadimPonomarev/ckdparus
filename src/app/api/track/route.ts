import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';
import UAParser from 'ua-parser-js';

// Функция для парсинга User-Agent
function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    browser: result.browser.name || 'Unknown',
    os: result.os.name || 'Unknown',
    deviceType: result.device.type || 'desktop',
    ua: userAgent,
  };
}

export async function POST(request: Request) {
  try {
    const { page, referrer } = await request.json();

    // headers() нужно использовать с await в Next.js 14+
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';

    // Парсим User-Agent
    const { browser, os, deviceType, ua } = parseUserAgent(userAgent);

    // Получаем или создаем sessionId из cookies
    const cookieHeader = headersList.get('cookie') || '';
    const sessionCookie = cookieHeader
      .split(';')
      .find((c: string) => c.trim().startsWith('session_id='));
    const sessionId = sessionCookie?.split('=')[1] || randomUUID();

    // Получаем геоданные (для Vercel)
    // @ts-ignore - request.geo доступен в Vercel
    const geo = request.geo || {};

    // Создаем запись в базе данных
    const pageView = await prisma.pageView.create({
      data: {
        page,
        referrer: referrer || null,
        userAgent: ua,
        country: geo.country || null,
        city: geo.city || null,
        deviceType,
        browser,
        os,
        sessionId,
        visitedAt: new Date(),
      },
    });

    // Создаем ответ
    const response = NextResponse.json({
      success: true,
      id: pageView.id,
    });

    // Устанавливаем cookie если его не было
    if (!sessionCookie) {
      response.cookies.set('session_id', sessionId, {
        maxAge: 60 * 60 * 24 * 30, // 30 дней
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    return response;
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track page view' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Tracking API is running',
    timestamp: new Date().toISOString(),
  });
}
