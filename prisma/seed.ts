const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, '../readings.json');
  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  const readings = JSON.parse(fileContent);

  console.log('--- Memulai proses Ingestion data ---');

  await prisma.reading.deleteMany({});

  await prisma.reading.createMany({
    data: readings.map((r: any) => ({
      sensor_id: r.sensor_id,
      value: r.value,
      unit: r.unit,
      timestamp: new Date(r.timestamp),
    })),
  });

  console.log(`--- Berhasil mengimpor ${readings.length} data ---`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });