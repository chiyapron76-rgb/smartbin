import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.smartBin.create({
    data: {
      bin_code: "BIN-001",
      model: "test-model",
      sensor_type: "ultrasonic",
      location_lat: 13.7563,
      location_lng: 100.5018,
      zone: "A",
      status: "normal",
    },
  });
}

main()
  .then(() => {
    console.log("Seed completed");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
