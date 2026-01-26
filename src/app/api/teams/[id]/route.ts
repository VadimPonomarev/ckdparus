// app/api/teams/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

async function getPrisma() {
  const { PrismaClient } = await import('@prisma/client');
  return new PrismaClient();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let prisma;

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID коллектива не указан' },
        { status: 400 }
      );
    }

    prisma = await getPrisma();

    const team = await (prisma as any).team.findUnique({
      where: { id: id },
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Коллектив не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  } finally {
    if (prisma) {
      await (prisma as any).$disconnect();
    }
  }
}
