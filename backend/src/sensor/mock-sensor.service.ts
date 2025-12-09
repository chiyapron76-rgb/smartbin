import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AlertType, BinDeviceStatus } from "@prisma/client";

@Injectable()
export class MockSensorService implements OnModuleInit {
  private readonly logger = new Logger(MockSensorService.name);

  constructor(private prisma: PrismaService) {}

  // รันหลัง NestJS โหลด module เสร็จ
  async onModuleInit() {
    this.logger.log("[MockSensor] waiting DB ready...");
    setTimeout(() => {
      this.startMocking();
    }, 3000); // delay 3 วินาที เพื่อให้ DB/migrate พร้อม
  }

  async createAlert(binId: string, type: AlertType, message: string) {
    return this.prisma.alert.create({
      data: { binId, alert_type: type, message },
    });
  }

  startMocking() {
    this.logger.log("[MockSensor] started!");

    setInterval(async () => {
      try {
        const bins = await this.prisma.smartBin.findMany();

        if (bins.length === 0) {
          this.logger.warn("No SmartBin records found. Mocking skipped.");
          return;
        }

        const now = new Date();

        for (const bin of bins) {
          const distance = Math.floor(Math.random() * 100);
          const fill = Math.min(100, Math.floor((100 - distance) + Math.random() * 10));
          const battery = Number((3.2 + Math.random() * 0.8).toFixed(2));
          const temp = Number((26 + Math.random() * 18).toFixed(1));

          await this.prisma.sensorRecord.create({
            data: {
              binId: bin.id,
              distance_cm: distance,
              fill_percentage: fill,
              battery_voltage: battery,
              temperature: temp,
            },
          });

          let status: BinDeviceStatus = BinDeviceStatus.active;

          if (fill >= 90 || battery < 3.4 || temp >= 45) {
            status = BinDeviceStatus.offline;
          } else if (fill >= 80 || battery < 3.6 || temp >= 40) {
            status = BinDeviceStatus.maintenance;
          }

          await this.prisma.smartBin.update({
            where: { id: bin.id },
            data: {
              last_heartbeat: now,
              status,
            },
          });

          // Clean + recreate alerts
          await this.prisma.alert.deleteMany({ where: { binId: bin.id } });

          if (fill >= 90) {
            await this.createAlert(bin.id, AlertType.full, `Bin almost full (${fill}%).`);
          }
          if (battery < 3.5) {
            await this.createAlert(bin.id, AlertType.low_battery, `Low battery (${battery}V).`);
          }
          if (temp >= 40) {
            await this.createAlert(bin.id, AlertType.high_temp, `High temperature detected (${temp}°C).`);
          }
          if (Math.random() < 0.05) {
            await this.createAlert(bin.id, AlertType.sensor_error, "Mock sensor failure occurred.");
          }

          // Cleanup sensor records
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

          // Cleanup alerts
          await this.prisma.$executeRawUnsafe(`
            DELETE FROM "Alert"
            WHERE "binId" = '${bin.id}'
            AND "id" NOT IN (
              SELECT "id" FROM "Alert"
              WHERE "binId" = '${bin.id}'
              ORDER BY "created_at" DESC
              LIMIT 20
            );
          `);
        }
      } catch (err) {
        this.logger.error("MockSensor error: " + err.message);
      }

    }, 10000);
  }
}
