// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

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

// DELETE - Удаление события
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Проверяем существование события
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Событие не найдено' },
        { status: 404 }
      );
    }

    // Удаляем событие
    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Событие успешно удалено',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// PUT - Обновление события (для редактирования)
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Проверяем существование события
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Событие не найдено' },
        { status: 404 }
      );
    }

    // Обновляем событие
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        briefdescription: body.briefdescription,
        fulldescription: body.fulldescription,
        date: new Date(body.date),
        location: body.location,
        price: body.price,
        imageUrl: body.imageUrl,
        category: body.category,
        isFeatured: body.isFeatured,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Событие успешно обновлено',
      data: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
