import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Очищаем существующие данные
  await prisma.galleryImage.deleteMany();
  await prisma.gallery.deleteMany();

  // Создаем тестовые галереи
  const gallery1 = await prisma.gallery.create({
    data: {
      title: 'Концертные выступления',
      description: 'Лучшие моменты с наших концертов',
      slug: 'concerts-2024',
      coverImage:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
            alt: 'Концерт на сцене',
            order: 0,
            caption: 'Главный концерт сезона',
          },
          {
            url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
            alt: 'Музыканты',
            order: 1,
            caption: 'Наши талантливые музыканты',
          },
          {
            url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
            alt: 'Зрители',
            order: 2,
            caption: 'Воодушевленные зрители',
          },
        ],
      },
    },
  });

  const gallery2 = await prisma.gallery.create({
    data: {
      title: 'Репетиции',
      description: 'Закулисные моменты подготовки',
      slug: 'rehearsals',
      coverImage:
        'https://images.unsplash.com/photo-1511735111819-9a3f7709049c',
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c',
            alt: 'Репетиция оркестра',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b',
            alt: 'Индивидуальные занятия',
            order: 1,
          },
        ],
      },
    },
  });

  console.log('Созданы галереи:', { gallery1, gallery2 });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
