// scripts/seed-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Создание администратора...');

  const adminUsername = 'daryvolro';
  const adminPassword = 'dasha1198'; // Поменяйте на свой пароль

  // Проверяем, существует ли уже администратор
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (existingAdmin) {
    console.log('✅ Администратор уже существует');
    return;
  }

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Создаем администратора
  const admin = await prisma.admin.create({
    data: {
      username: adminUsername,
      password: hashedPassword,
    },
  });

  console.log('✅ Администратор создан успешно!');
  console.log(`👤 Имя пользователя: ${adminUsername}`);
  console.log(`🔑 Пароль: ${adminPassword}`);
  console.log('⚠️ Не забудьте изменить пароль после первого входа!');
}

main()
  .catch(e => {
    console.error('❌ Ошибка создания администратора:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
