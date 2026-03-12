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

    // Обновляем галерею в транзакции
    const result = await prisma.$transaction(async prisma => {
      // 1. Обновляем основную информацию галереи
      const updatedGallery = await prisma.gallery.update({
        where: { id },
        data: {
          title: body.title,
          description: body.description,
          slug: body.slug,
          coverImage: body.coverImage,
        },
      });

      // 2. Удаляем все существующие изображения галереи
      await prisma.galleryImage.deleteMany({
        where: { galleryId: id },
      });

      // 3. Создаем все изображения заново (и старые, и новые)
      if (body.images && body.images.length > 0) {
        await prisma.galleryImage.createMany({
          data: body.images.map((img: any, index: number) => ({
            galleryId: id,
            url: img.url,
            alt: img.alt || null,
            caption: img.caption || null,
            order: img.order !== undefined ? img.order : index,
          })),
        });
      }

      // 4. Возвращаем обновленную галерею с изображениями
      return await prisma.gallery.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
        },
      });
    });

    return NextResponse.json(result);
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

    // Удаляем галерею (изображения удалятся каскадно благодаря связям в БД)
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
