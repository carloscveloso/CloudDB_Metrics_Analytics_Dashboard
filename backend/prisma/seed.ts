import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Criar utilizador admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@clouddb.com' },
    update: {},
    create: {
      email: 'admin@clouddb.com',
      password: adminPassword,
      name: 'Admin CloudDB',
      role: 'OWNER',
      tenantId: 'tenant_default',
    },
  });

  console.log(`✅ Admin criado: ${admin.email}`);

  // Criar algumas instâncias
  const instances = [
    {
      name: 'Production-Postgres',
      provider: 'AWS',
      region: 'us-east-1',
      status: 'healthy',
      userId: admin.id,
      tenantId: admin.tenantId,
    },
    {
      name: 'Analytics-ClickHouse',
      provider: 'GCP',
      region: 'europe-west1',
      status: 'warning',
      userId: admin.id,
      tenantId: admin.tenantId,
    },
    {
      name: 'Cache-RedisCluster',
      provider: 'Azure',
      region: 'eastus',
      status: 'healthy',
      userId: admin.id,
      tenantId: admin.tenantId,
    },
  ];

  for (const instanceData of instances) {
    const instance = await prisma.instance.upsert({
      where: { id: 'placeholder' },
      update: {},
      create: instanceData,
    });
    console.log(`Instância criada: ${instance.name}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });