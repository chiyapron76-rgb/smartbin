import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MockSensorService {
  private readonly logger = new Logger(MockSensorService.name);

  constructor(private prisma: PrismaService) {
    this.startMocking();
  }

  startMocking() {
    setInterval(async () => {
      const bins = await this.prisma.smartBin.findMany();

      for (const bin of bins) {
        const distance = Math.floor(Math.random() * 100);  // cm
        const fill = Math.min(100, Math.floor((100 - distance) + Math.random() * 10));
        const battery = (3.5 + Math.random() * 0.6).toFixed(2);
        const temp = (26 + Math.random() * 6).toFixed(1);

        await this.prisma.sensorRecord.create({
          data: {
            binId: bin.id,
            distance_cm: distance,
            fill_percentage: fill,
            battery_voltage: Number(battery),
            temperature: Number(temp),
          },
        });

        // อัปเดต bin
        await this.prisma.smartBin.update({
          where: { id: bin.id },
          data: {
            last_heartbeat: new Date(),
            status: fill >= 90 ? "warning" : "normal",
          },
        });

        // ลบ record เก่า (>50)
        await this.prisma.$executeRawUnsafe(`
          DELETE FROM "SensorRecord"
          WHERE "binId" = '${bin.id}'
          AND "id" NOT IN (
            SELECT "id" FROM "SensorRecord"
            WHERE "binId" = '${bin.id}'
            ORDER BY "timestamp" DESC
            LIMIT 50
          );
        `);
      }
    }, 10_000); // ทุก 10 วินาที
  }
}
