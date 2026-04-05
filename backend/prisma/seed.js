const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

const users = [
  {
    name: 'Admin User',
    email: 'admin@finance.com',
    password: 'Admin@123',
    role: 'ADMIN'
  },
  {
    name: 'Jane Analyst',
    email: 'analyst@finance.com',
    password: 'Analyst@123',
    role: 'ANALYST'
  },
  {
    name: 'John Viewer',
    email: 'viewer@finance.com',
    password: 'Viewer@123',
    role: 'VIEWER'
  }
];

const categories = ['Salary', 'Rent', 'Food', 'Utilities', 'Investment', 'Sales', 'Transport', 'Healthcare'];

const recordTemplates = [
  { type: 'INCOME', category: 'Salary', amount: 5000, notes: 'Monthly salary payment' },
  { type: 'EXPENSE', category: 'Rent', amount: 1200, notes: 'Monthly apartment rent' },
  { type: 'EXPENSE', category: 'Food', amount: 350, notes: 'Grocery shopping' },
  { type: 'EXPENSE', category: 'Utilities', amount: 180, notes: 'Electric and water bills' },
  { type: 'INCOME', category: 'Investment', amount: 450, notes: 'Stock dividend payment' },
  { type: 'INCOME', category: 'Sales', amount: 1200, notes: 'Freelance project payment' },
  { type: 'EXPENSE', category: 'Transport', amount: 85, notes: 'Gas and public transport' },
  { type: 'EXPENSE', category: 'Healthcare', amount: 120, notes: 'Medical checkup' },
  { type: 'EXPENSE', category: 'Food', amount: 65, notes: 'Restaurant dinner' },
  { type: 'INCOME', category: 'Investment', amount: 320, notes: 'Bond interest payment' },
  { type: 'EXPENSE', category: 'Rent', amount: 1200, notes: 'Monthly apartment rent' },
  { type: 'INCOME', category: 'Salary', amount: 5000, notes: 'Monthly salary payment' },
  { type: 'EXPENSE', category: 'Utilities', amount: 195, notes: 'Internet and phone bills' },
  { type: 'EXPENSE', category: 'Transport', amount: 120, notes: 'Car maintenance' },
  { type: 'INCOME', category: 'Sales', amount: 800, notes: 'Side project income' },
  { type: 'EXPENSE', category: 'Healthcare', amount: 45, notes: 'Pharmacy purchase' },
  { type: 'EXPENSE', category: 'Food', amount: 220, notes: 'Weekly groceries' },
  { type: 'INCOME', category: 'Investment', amount: 180, notes: 'Crypto trading profit' },
  { type: 'EXPENSE', category: 'Utilities', amount: 165, notes: 'Electric bill' },
  { type: 'EXPENSE', category: 'Rent', amount: 1200, notes: 'Monthly apartment rent' }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.financialRecord.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👥 Creating users...');
  const createdUsers = [];
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        status: 'ACTIVE'
      }
    });
    createdUsers.push(user);
    console.log(`  ✓ Created ${userData.role}: ${userData.email}`);
  }

  const adminUser = createdUsers.find(u => u.role === 'ADMIN');

  // Create financial records
  console.log('📊 Creating financial records...');
  const now = new Date();
  
  for (let i = 0; i < recordTemplates.length; i++) {
    const template = recordTemplates[i];
    // Spread dates across last 6 months
    const date = new Date(now);
    date.setMonth(date.getMonth() - Math.floor(i / 4));
    date.setDate(1 + (i % 28)); // Spread across days

    // Add some variation to amounts
    const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
    const amount = Math.round(template.amount * (1 + variation) * 100) / 100;

    await prisma.financialRecord.create({
      data: {
        amount: amount,
        type: template.type,
        category: template.category,
        date: date,
        notes: template.notes,
        createdById: adminUser.id
      }
    });
  }
  console.log(`  ✓ Created ${recordTemplates.length} financial records`);

  console.log('✅ Seed completed successfully!');
  console.log('\n📋 Demo Accounts:');
  console.log('  Admin:    admin@finance.com / Admin@123');
  console.log('  Analyst:  analyst@finance.com / Analyst@123');
  console.log('  Viewer:   viewer@finance.com / Viewer@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
