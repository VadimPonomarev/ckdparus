// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Типы для запроса на создание события
interface CreateEventRequest {
  title: string;
  briefdescription: string;
  fulldescription?: string | null;
  date: string;
  location: string;
  price: number;
  imageUrl?: string | null;
  category?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

// GET - Получение списка событий с пагинацией
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');
    const future = searchParams.get('future');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset'); // Добавляем offset

    const where: any = {
      isActive: true,
    };

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (future === 'true') {
      where.date = {
        gte: new Date(),
      };
    }

    // Получаем общее количество событий для проверки наличия следующих страниц
    const totalCount = await prisma.event.count({ where });

    const events = await prisma.event.findMany({
      where,
      orderBy: {
        date: 'asc',
      },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : 0, // Добавляем пропуск для пагинации
    });

    // Возвращаем события и общее количество
    return NextResponse.json({
      events,
      totalCount,
      hasMore:
        events.length === (limit ? parseInt(limit) : 10) &&
        (offset ? parseInt(offset) + events.length : events.length) <
          totalCount,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST - Создание нового события
export async function POST(request: NextRequest) {
  try {
    // Проверяем Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Парсим тело запроса
    const body: CreateEventRequest = await request.json();

    // Валидация обязательных полей
    const validationErrors: string[] = [];

    if (!body.title?.trim())
      validationErrors.push('Название события обязательно');
    if (!body.briefdescription?.trim())
      validationErrors.push('Описание события обязательно');
    if (!body.date) validationErrors.push('Дата события обязательна');
    if (!body.location?.trim())
      validationErrors.push('Место проведения обязательно');
    if (body.price === undefined || body.price < 0)
      validationErrors.push('Цена должна быть неотрицательной');

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    // Проверяем дату
    const eventDate = new Date(body.date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json({ error: 'Некорректная дата' }, { status: 400 });
    }

    // Проверяем, что дата в будущем
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Сбрасываем время для сравнения только дат
    if (eventDate < now) {
      return NextResponse.json(
        {
          error:
            'Дата события должна быть в будущем. Укажите дату позже сегодняшней.',
        },
        { status: 400 }
      );
    }

    // Создаем событие
    const event = await prisma.event.create({
      data: {
        title: body.title.trim(),
        briefdescription: body.briefdescription.trim(),
        fulldescription: body.fulldescription?.trim() || null,
        date: eventDate,
        location: body.location.trim(),
        price: body.price,
        imageUrl: body.imageUrl?.trim() || null,
        category: body.category?.trim() || 'другое',
        isFeatured: body.isFeatured || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    // Возвращаем успешный ответ
    return NextResponse.json(
      {
        success: true,
        message: 'Событие успешно создано',
        data: event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);

    // Обработка специфических ошибок
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          { error: 'Событие с таким названием уже существует' },
          { status: 409 }
        );
      }

      if (error.message.includes('Invalid value')) {
        return NextResponse.json(
          { error: 'Некорректные данные в запросе' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
