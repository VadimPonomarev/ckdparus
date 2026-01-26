// app/api/teams/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        subcategory: true,
        isActive: true,
      },
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    await prisma.$disconnect();

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
