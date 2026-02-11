// app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - получение новостей
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = searchParams.get('limit');

    let where: any = {};

    if (published === 'true') {
      where.isPublished = true;
    }

    const take = limit ? parseInt(limit) : 10;

    const news = await prisma.news.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении новостей' },
      { status: 500 }
    );
  }
}

// POST - создание новости
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, imageUrl, images, isPublished } = body;

    // Создаем новость
    const news = await prisma.news.create({
      data: {
        title,
        content,
        excerpt: excerpt || null,
        imageUrl: imageUrl || null,
        isPublished: isPublished ?? true,
      },
    });

    // Если есть изображения, создаем их отдельно
    if (images && images.length > 0) {
      await prisma.newsImage.createMany({
        data: images.map((img: any, index: number) => ({
          newsId: news.id,
          url: img.url,
          alt: img.alt || null,
          caption: img.caption || null,
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

    return NextResponse.json(newsWithImages, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании новости' },
      { status: 500 }
    );
  }
}
