// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const future = searchParams.get('future');

    const where: any = {
      isActive: true,
    };

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (future === 'true') {
      where.date = {
        gte: new Date(),
      };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: {
        date: 'asc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
