// app/api/news/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - получение конкретной новости
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Находим новость с изображениями
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
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении новости' },
      { status: 500 }
    );
  }
}

// PUT - обновление новости
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { title, content, excerpt, imageUrl, images, isPublished } = body;

    // Обновляем новость
    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title,
        content,
        excerpt: excerpt || null,
        imageUrl: imageUrl || null,
        isPublished: isPublished ?? true,
      },
    });

    // Если переданы изображения, обновляем их
    if (images && Array.isArray(images)) {
      // Удаляем старые изображения
      await prisma.newsImage.deleteMany({
        where: { newsId: id },
      });

      // Создаем новые изображения
      if (images.length > 0) {
        await prisma.newsImage.createMany({
          data: images.map((img: any, index: number) => ({
            newsId: id,
            url: img.url,
            alt: img.alt || null,
            caption: img.caption || null,
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

    return NextResponse.json(newsWithImages);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении новости' },
      { status: 500 }
    );
  }
}

// DELETE - удаление новости
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении новости' },
      { status: 500 }
    );
  }
}
