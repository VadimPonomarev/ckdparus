// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Защищаем маршруты /admin/*
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Простая проверка (замените на свою логику)
    const isAdmin = request.cookies.get('admin_token');

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}

export const config = {
  matcher: '/admin/:path*',
};
