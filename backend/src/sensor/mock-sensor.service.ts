import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MockSensorService {
  private readonly logger = new Logger(MockSensorService.name);

  constructor(private prisma: PrismaService) {
    this.startMocking();
  }

  async createAlert(binId: string, type: string, message: string) {
    return this.prisma.alert.create({
      data: { binId, alert_type: type, message },
    });
  }

  startMocking() {
    this.logger.log("[MockSensor] started!");

    setInterval(async () => {
      const bins = await this.prisma.smartBin.findMany();
      const now = new Date();

      for (const bin of bins) {
        // Generate random sensor values
        const distance = Math.floor(Math.random() * 100);
        const fill = Math.min(100, Math.floor((100 - distance) + Math.random() * 10));
        const battery = Number((3.2 + Math.random() * 0.8).toFixed(2));
        const temp = Number((26 + Math.random() * 20).toFixed(1));

        // Create latest sensor record
        await this.prisma.sensorRecord.create({
          data: {
            binId: bin.id,
            distance_cm: distance,
            fill_percentage: fill,
            battery_voltage: battery,
            temperature: temp,
          },
        });

        // Update SmartBin heartbeat + status
        await this.prisma.smartBin.update({
          where: { id: bin.id },
          data: {
            last_heartbeat: now,
            status: fill >= 90 ? "warning" : "normal",
          },
        });

        // ------------------------------------------------------
        // ALERTS LOGIC: Based on THIS RECORD ONLY
        // ------------------------------------------------------

        // 1) ลบ alert เก่าทั้งหมดของถังนี้ก่อน
        await this.prisma.alert.deleteMany({
          where: { binId: bin.id },
        });

        // 2) ตรวจสอบ alert ใหม่ตาม record ล่าสุด
        const newAlerts: { alert_type: string; message: string }[] = [];

        // ถังเต็ม > 90%
        if (fill >= 90) {
          newAlerts.push({
            alert_type: "BIN_FULL",
            message: `Bin almost full (${fill}%).`,
          });
        }

        // แบตต่ำ < 3.5V
        if (battery < 3.5) {
          newAlerts.push({
            alert_type: "BATTERY_LOW",
            message: `Low battery (${battery}V).`,
          });
        }

        // อุณหภูมิสูง ≥ 40°C
        if (temp >= 40) {
          newAlerts.push({
            alert_type: "HIGH_TEMP",
            message: `High temperature detected (${temp}°C).`,
          });
        }

        // offline > 2 นาที
        if (bin.last_heartbeat) {
          const diffMin = (now.getTime() - new Date(bin.last_heartbeat).getTime()) / 1000 / 60;
          if (diffMin > 2) {
            newAlerts.push({
              alert_type: "OFFLINE",
              message: `Bin offline for ${diffMin.toFixed(1)} minutes.`,
            });
          }
        }

        // sensor error (mock 5%)
        if (Math.random() < 0.05) {
          newAlerts.push({
            alert_type: "SENSOR_ERROR",
            message: `Mock sensor failure occurred.`,
          });
        }

        // 3) บันทึก alert ใหม่ทั้งหมด (เฉพาะรอบล่าสุด)
        for (const a of newAlerts) {
          await this.createAlert(bin.id, a.alert_type, a.message);
        }

        // ------------------------------------------------------
        // Cleanup old sensorRecords (keep last 50)
        // ------------------------------------------------------
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

    }, 10_000); // every 10 seconds
  }
}
