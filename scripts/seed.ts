import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Очищаем существующие данные
    await prisma.event.deleteMany();
    await prisma.news.deleteMany();

    // Создаем события
    const events = await prisma.event.createMany({
      data: [
        {
          title: 'Концерт симфонического оркестра',
          briefdescription: 'Вечер классической музыки',
          fulldescription: 'Вечер классической музыки полное описание ',
          date: new Date('2024-12-25T19:00:00'),
          location: 'Большой концертный зал',
          price: 1500,
          category: 'концерт',
          isFeatured: true,
          isActive: true,
        },
        {
          title: 'Выставка современного искусства',
          briefdescription: 'Работы местных художников',
          fulldescription: 'Работы местных художников полное описание',
          date: new Date('2024-11-15T10:00:00'),
          location: 'Галерея искусств',
          price: 500,
          category: 'выставка',
          isActive: true,
        },
      ],
    });

    // Создаем новости
    const news = await prisma.news.createMany({
      data: [
        {
          title: 'Открытие нового сезона',
          content: 'Мы рады объявить о начале нового сезона.',
          excerpt: 'Анонс мероприятий',
          isPublished: true,
        },
      ],
    });
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
