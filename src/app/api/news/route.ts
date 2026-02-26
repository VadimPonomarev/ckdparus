// app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Типы для запроса на создание новости
interface CreateNewsRequest {
  title: string;
  content: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  isPublished?: boolean;
  images?: Array<{
    url: string;
    alt?: string | null;
    caption?: string | null;
    order?: number;
  }>;
}

// GET - Получение списка новостей с пагинацией
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const where: any = {};

    if (published === 'true') {
      where.isPublished = true;
    }

    // Получаем общее количество новостей для проверки наличия следующих страниц
    const totalCount = await prisma.news.count({ where });

    const news = await prisma.news.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : 0,
    });

    // Возвращаем новости и общее количество
    return NextResponse.json({
      news,
      totalCount,
      hasMore:
        news.length === (limit ? parseInt(limit) : 10) &&
        (offset ? parseInt(offset) + news.length : news.length) < totalCount,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST - Создание новой новости
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
    const body: CreateNewsRequest = await request.json();

    // Валидация обязательных полей
    const validationErrors: string[] = [];

    if (!body.title?.trim()) {
      validationErrors.push('Заголовок новости обязателен');
    }

    if (!body.content?.trim()) {
      validationErrors.push('Содержание новости обязательно');
    }

    if (body.excerpt && body.excerpt.length > 300) {
      validationErrors.push(
        'Краткое описание не должно превышать 300 символов'
      );
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    // Создаем новость
    const news = await prisma.news.create({
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
        excerpt: body.excerpt?.trim() || null,
        imageUrl: body.imageUrl?.trim() || null,
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
      },
    });

    // Если есть изображения, создаем их отдельно
    if (body.images && body.images.length > 0) {
      // Валидация изображений
      for (const [index, img] of body.images.entries()) {
        if (!img.url?.trim()) {
          return NextResponse.json(
            { error: `URL изображения ${index + 1} обязателен` },
            { status: 400 }
          );
        }
      }

      await prisma.newsImage.createMany({
        data: body.images.map((img, index) => ({
          newsId: news.id,
          url: img.url.trim(),
          alt: img.alt?.trim() || null,
          caption: img.caption?.trim() || null,
          order: img.order ?? index,
        })),
      });
    }

    // Получаем созданную новость вместе с изображениями
    const newsWithImages = await prisma.news.findUnique({
      where: { id: news.id },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // Возвращаем успешный ответ
    return NextResponse.json(
      {
        success: true,
        message: 'Новость успешно создана',
        data: newsWithImages,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating news:', error);

    // Обработка специфических ошибок
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          { error: 'Новость с таким заголовком уже существует' },
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
