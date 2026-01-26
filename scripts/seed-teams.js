// create-team.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTeam() {
  try {
    console.log('🔄 Проверяем подключение к базе...');

    // Сначала проверим количество коллективов
    const count = await prisma.team.count();
    console.log(`📊 Текущее количество коллективов: ${count}`);

    // Создаем коллектив "Луиза" с явным ID
    const teamData = {
      id: 'luiza', // Уникальный ID
      name: 'Образцовый хореографический ансамбль «Луиза»',
      slug: 'luiza',
      foundationDate: '1990 г.',
      titleAwardDate: '1995 год',
      lastConfirmation:
        'Приказ № 274 – ОД Министерства культуры Калининградской области от 03.10.2022 г.',
      leaderName: 'Петрова Ирина Валерьевна',
      leaderNameSecondary: 'Петрова Юлия Игоревна',
      participantsAge: 'девушки в возрасте от 11 до 18 лет',
      description: 'Образцовый хореографический ансамбль «Луиза»',
      content: `Ансамбль «Луиза» – многочисленный и сплоченный коллектив с большими творческими планами и возможностями.

Состав участников образцового хореографического ансамбля «Луиза» – девушки в возрасте от 11 до 18 лет.

Участникам ансамбля преподается: основы классического танца, народного, современного и эстрадного танца, акробатика.

Образцовый хореографический ансамбль «Луиза» обладает высоким исполнительским мастерством и пользуется заслуженным авторитетом не только в городе, области, но далеко за ее пределами.`,
      imageUrl: '/images/teams/luiza.jpg',
      category: 'Хореография',
      isActive: true,
    };

    console.log('\n➕ Создаем коллектив...');

    const team = await prisma.team.create({
      data: teamData,
    });

    console.log('✅ КОЛЛЕКТИВ УСПЕШНО СОЗДАН!');
    console.log('='.repeat(50));
    console.log(`ID: ${team.id}`);
    console.log(`Название: ${team.name}`);
    console.log(`Slug: ${team.slug}`);
    console.log(`Дата создания: ${team.createdAt}`);
    console.log(`\n🔗 Ссылка для просмотра:`);
    console.log(`http://localhost:3000/teams/${team.id}`);
    console.log('='.repeat(50));

    // Показываем все коллективы
    const allTeams = await prisma.team.findMany();
    console.log(`\n📋 Всего коллективов в базе: ${allTeams.length}`);
  } catch (error) {
    console.error('❌ Ошибка при создании коллектива:', error.message);

    // Если ошибка уникальности - покажем существующие
    if (error.code === 'P2002') {
      console.log('\n⚠️ Коллектив с таким slug уже существует');
      const existing = await prisma.team.findUnique({
        where: { slug: 'luiza' },
      });
      if (existing) {
        console.log(`\n📌 Существующий коллектив:`);
        console.log(`ID: ${existing.id}`);
        console.log(`Название: ${existing.name}`);
        console.log(`Ссылка: http://localhost:3000/teams/${existing.id}`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTeam();
