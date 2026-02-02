import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - получение конкретной новости
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Находим новость
    const news = await prisma.news.findUnique({
      where: { id },
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || null,
        imageUrl: body.imageUrl || null,
        isPublished: body.isPublished,
      },
    });

    return NextResponse.json(updatedNews);
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
