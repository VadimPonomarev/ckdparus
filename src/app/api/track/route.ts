import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';

// Простая функция для определения браузера и ОС без библиотеки
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();

  // Определение браузера
  let browser = 'Unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';

  // Определение ОС
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios')) os = 'iOS';

  // Определение типа устройства
  let deviceType = 'desktop';
  if (ua.includes('mobile')) deviceType = 'mobile';
  else if (ua.includes('tablet')) deviceType = 'tablet';

  return {
    browser,
    os,
    deviceType,
    ua: userAgent,
  };
}

export async function POST(request: Request) {
  try {
    const { page, referrer } = await request.json();

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';

    const { browser, os, deviceType, ua } = parseUserAgent(userAgent);

    const cookieHeader = headersList.get('cookie') || '';
    const sessionCookie = cookieHeader
      .split(';')
      .find((c: string) => c.trim().startsWith('session_id='));
    const sessionId = sessionCookie?.split('=')[1] || randomUUID();

    // @ts-ignore - request.geo доступен в Vercel
    const geo = request.geo || {};

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

    const response = NextResponse.json({
      success: true,
      id: pageView.id,
    });

    if (!sessionCookie) {
      response.cookies.set('session_id', sessionId, {
        maxAge: 60 * 60 * 24 * 30,
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
