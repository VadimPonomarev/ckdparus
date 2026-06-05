// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!JWT_SECRET) {
      console.error('JWT_SECRET не настроен в переменных окружения');
      return NextResponse.json(
        { valid: false, error: 'Ошибка конфигурации сервера' },
        { status: 500 }
      );
    }

    // Сначала пытаемся получить токен из cookies
    let token = request.cookies.get('token')?.value;

    // Если нет в cookies, пробуем из тела запроса (для обратной совместимости)
    if (!token) {
      const body = await request.json();
      token = body.token;
    }

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Токен отсутствует' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      return NextResponse.json({
        valid: true,
        user: decoded,
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json(
          { valid: false, error: 'Токен просрочен' },
          { status: 401 }
        );
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json(
          { valid: false, error: 'Недействительный токен' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { valid: false, error: 'Ошибка верификации токена' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { valid: false, error: 'Ошибка проверки токена' },
      { status: 500 }
    );
  }
}