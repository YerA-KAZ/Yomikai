import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Обновляем всех существующих пользователей (или первого), делая их админами
  const updatedUsers = await prisma.user.updateMany({
    data: {
      role: 'admin',
    },
  });

  console.log(`Успешно обновлено пользователей до роли admin: ${updatedUsers.count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
