import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/**
 * Seed script for database
 * Creates an admin user for initial setup
 * Run with: npx ts-node prisma/seed.ts
 */

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@sweetflow.com';
  const adminPassword = 'admin123';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created successfully!');
  console.log('Email:', adminEmail);
  console.log('Password:', adminPassword);
  console.log('Please change the password after first login!');

  // Create some sample sweets
  const sweets = [
    {
      name: 'Gulab Jamun',
      category: 'Indian',
      price: 50.0,
      quantity: 100,
    },
    {
      name: 'Rasgulla',
      category: 'Indian',
      price: 40.0,
      quantity: 80,
    },
    {
      name: 'Jalebi',
      category: 'Indian',
      price: 45.0,
      quantity: 60,
    },
    {
      name: 'Kaju Katli',
      category: 'Indian',
      price: 80.0,
      quantity: 50,
    },
    {
      name: 'Barfi',
      category: 'Indian',
      price: 55.0,
      quantity: 70,
    },
  ];

  for (const sweet of sweets) {
    await prisma.sweet.create({
      data: sweet,
    });
  }

  console.log('Sample sweets created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


