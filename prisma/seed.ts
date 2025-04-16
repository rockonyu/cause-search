import { faker } from "@faker-js/faker";
import { Organization, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organizationCount = await prisma.organization.count();
  if (organizationCount > 0) {
    console.log("🌱 Database already seeded. Exiting...");
    return;
  }

  console.log("🌱 Seeding database...");

  const organizations: Omit<Organization, "id">[] = Array.from(
    { length: 108 },
    () => ({
      name: faker.company.name(),
      description: faker.lorem.paragraph(2),
      thumbnail: faker.image.url(),
      createdAt: faker.date.past(),
    })
  );

  await prisma.organization.createMany({ data: organizations });

  console.log(`🌱 Seeded ${organizations.length} organizations`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
