// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Находим событие
    const event = await prisma.event.findUnique({
      where: {
        id,
        isActive: true,
      },
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
        createdAt: true,
        updatedAt: true,
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
