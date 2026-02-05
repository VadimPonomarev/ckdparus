import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - получение всех галерей
export async function GET(request: NextRequest) {
  try {
    const galleries = await prisma.gallery.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1, // Берем только первую картинку для превью
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(galleries);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении галерей' },
      { status: 500 }
    );
  }
}

// POST - создание галереи
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const gallery = await prisma.gallery.create({
      data: {
        title: body.title,
        description: body.description,
        slug: body.slug,
        coverImage: body.coverImage || null,
        images: {
          create:
            body.images?.map((img: any, index: number) => ({
              url: img.url,
              alt: img.alt || '',
              order: index,
              caption: img.caption || null,
            })) || [],
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании галереи' },
      { status: 500 }
    );
  }
}
