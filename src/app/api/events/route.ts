// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const future = searchParams.get('future');

    // Базовый запрос
    const where: any = {
      isActive: true,
    };

    // Фильтр по избранным
    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Фильтр по будущим событиям
    if (future === 'true') {
      where.date = {
        gte: new Date(),
      };
    }

    // Получаем события
    const events = await prisma.event.findMany({
      where,
      orderBy: {
        date: 'asc',
      },
      take: limit ? parseInt(limit) : undefined,
      select: {
        id: true,
        title: true,
        briefdescription: true,
        fulldescription: true,
        date: true,
        location: true,
        price: true,
        imageUrl: true,
        category: true,
        isActive: true,
        isFeatured: true,
        views: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
