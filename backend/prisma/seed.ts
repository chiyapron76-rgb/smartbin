import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {

  console.log("Clearing SensorRecord...");
  await prisma.sensorRecord.deleteMany();   // 1) ลบ sensor ก่อน

  console.log("Clearing Alert...");
  await prisma.alert.deleteMany();          // 2) ลบ alert หลัง sensor

  console.log("Clearing SmartBin...");
  await prisma.smartBin.deleteMany();       // 3) ค่อยลบ SmartBin

  console.log("Creating 10 SmartBins...");
  for (let i = 1; i <= 10; i++) {
    await prisma.smartBin.create({
      data: {
        bin_code: `BIN-${String(i).padStart(3, "0")}`,
        model: "test-model",
        sensor_type: "ultrasonic",
        location_lat: 13.7563 + Math.random() * 0.01,
        location_lng: 100.5018 + Math.random() * 0.01,
        zone: "A",
        status: "normal",
      },
    });
  }

  console.log("Finished seeding SmartBin!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());
