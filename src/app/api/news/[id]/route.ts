// app/api/news/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Получение конкретной новости по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!news) {
      return NextResponse.json(
        { error: 'Новость не найдена' },
        { status: 404 }
      );
    }

    // Увеличиваем счетчик просмотров
    await prisma.news.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// PATCH - Обновление новости
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Проверяем существование новости
    const existingNews = await prisma.news.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: 'Новость не найдена' },
        { status: 404 }
      );
    }

    // Валидация
    const validationErrors: string[] = [];

    if (body.title !== undefined && !body.title.trim()) {
      validationErrors.push('Заголовок не может быть пустым');
    }

    if (body.content !== undefined && !body.content.trim()) {
      validationErrors.push('Содержание не может быть пустым');
    }

    if (body.excerpt !== undefined && body.excerpt.length > 300) {
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

    // Обновляем новость
    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title: body.title?.trim(),
        content: body.content?.trim(),
        excerpt: body.excerpt?.trim(),
        imageUrl: body.imageUrl?.trim(),
        isPublished: body.isPublished,
      },
    });

    // Обновляем изображения, если они есть
    if (body.images) {
      // Удаляем старые изображения
      await prisma.newsImage.deleteMany({
        where: { newsId: id },
      });

      // Создаем новые
      if (body.images.length > 0) {
        await prisma.newsImage.createMany({
          data: body.images.map((img: any, index: number) => ({
            newsId: id,
            url: img.url.trim(),
            alt: img.alt?.trim() || null,
            caption: img.caption?.trim() || null,
            order: img.order ?? index,
          })),
        });
      }
    }

    // Получаем обновленную новость с изображениями
    const newsWithImages = await prisma.news.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Новость успешно обновлена',
      data: newsWithImages,
    });
  } catch (error) {
    console.error('Error updating news:', error);

    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed')) {
        return NextResponse.json(
          { error: 'Новость с таким заголовком уже существует' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE - Удаление новости
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Проверяем существование новости
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: 'Новость не найдена' },
        { status: 404 }
      );
    }

    // Удаляем новость (связанные изображения удалятся каскадно)
    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Новость успешно удалена',
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
