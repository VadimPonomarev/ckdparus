const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Создание администратора...');

  const adminEmail = 'admin@ckdparus.ru';
  const adminPassword = '5HTm3w8qa2fQ';

  // Проверяем, существует ли уже администратор
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Администратор уже существует');
    return;
  }

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Создаем администратора
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Администратор',
      role: 'ADMIN',
    },
  });

  console.log('✅ Администратор создан успешно!');
  console.log(`📧 Email: ${adminEmail}`);
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
