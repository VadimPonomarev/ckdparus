import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - получение конкретной галереи
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const gallery = await prisma.gallery.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!gallery) {
      return NextResponse.json(
        { error: 'Галерея не найдена' },
        { status: 404 }
      );
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении галереи' },
      { status: 500 }
    );
  }
}

// PUT - обновление галереи
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Обновляем галерею
    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        slug: body.slug,
        coverImage: body.coverImage || null,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(updatedGallery);
  } catch (error) {
    console.error('Error updating gallery:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении галереи' },
      { status: 500 }
    );
  }
}

// DELETE - удаление галереи
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.gallery.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении галереи' },
      { status: 500 }
    );
  }
}
