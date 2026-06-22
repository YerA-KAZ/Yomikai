import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.practiceSession.createMany({
    data: [
      {
        id: 'p5',
        type: 'flashcards',
        title: 'Флеш-карты: Хирагана',
        description: 'Классические карточки для запоминания символов хираганы.',
        icon: 'Layers',
        itemCount: 46,
        completedCount: 0,
        accuracy: 0,
        sortOrder: 4
      },
      {
        id: 'p6',
        type: 'writing',
        title: 'Письмо: Катакана',
        description: 'Тренировка правильного написания символов катаканы.',
        icon: 'PenTool',
        itemCount: 46,
        completedCount: 0,
        accuracy: 0,
        sortOrder: 5
      }
    ],
    skipDuplicates: true
  });
  console.log('Successfully added new practice sessions to the database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
