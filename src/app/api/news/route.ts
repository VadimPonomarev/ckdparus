import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - получение новостей
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');

    let where: any = {};

    if (published === 'true') {
      where.isPublished = true;
    }

    if (featured === 'true') {
      where.isFeatured = true;
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

    const news = await prisma.news.create({
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || null,
        imageUrl: body.imageUrl || null,
        isPublished: body.isPublished ?? true,
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании новости' },
      { status: 500 }
    );
  }
}
