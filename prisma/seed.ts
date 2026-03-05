import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email    = process.env.ADMIN_EMAIL    ?? 'admin@gmail.com';
  const password = process.env.ADMIN_PASSWORD ?? 'Password@123';

  // Hasher le mot de passe — ne jamais stocker en clair
  const hashed = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where:  { email },
    update: {},
    create: { email, password: hashed },
  });

  console.log(`✅ Admin créé : ${email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());