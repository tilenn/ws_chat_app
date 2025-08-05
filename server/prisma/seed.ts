import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const defaultRooms = [
  { name: "General" },
  { name: "Tech" },
  { name: "Random" },
];

async function main() {
  console.log("Start seeding...");

  for (const room of defaultRooms) {
    await prisma.room.upsert({
      where: { name: room.name },
      update: {},
      create: room,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
