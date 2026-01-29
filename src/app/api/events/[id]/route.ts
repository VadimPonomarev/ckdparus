// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Исправленный тип для параметров
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    // Дожидаемся параметров (они асинхронные в Next.js 14+)
    const { id } = await context.params;

    // Находим событие
    const event = await prisma.event.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Событие не найдено' },
        { status: 404 }
      );
    }

    // Увеличиваем счетчик просмотров
    await prisma.event.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
