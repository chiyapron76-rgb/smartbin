import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AlertType, BinDeviceStatus } from "@prisma/client";

@Injectable()
export class MockSensorService {
  private readonly logger = new Logger(MockSensorService.name);

  constructor(private prisma: PrismaService) {
    this.startMocking();
  }

  async createAlert(binId: string, type: AlertType, message: string) {
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
        // สุ่มค่า sensor
        const distance = Math.floor(Math.random() * 100);
        const fill = Math.min(100, Math.floor((100 - distance) + Math.random() * 10));
        const battery = Number((3.2 + Math.random() * 0.8).toFixed(2));
        const temp = Number((26 + Math.random() * 18).toFixed(1));

        // create sensor record
        await this.prisma.sensorRecord.create({
          data: {
            binId: bin.id,
            distance_cm: distance,
            fill_percentage: fill,
            battery_voltage: battery,
            temperature: temp,
          },
        });

        // กำหนดสถานะ device ตาม rule (ใช้ enum ใน schema: active/inactive/...)
        let status: BinDeviceStatus = BinDeviceStatus.active;

        // ตัวอย่าง mapping: ปรับให้ตรง policy คุณได้
        if (fill >= 90 || battery < 3.4 || temp >= 45) {
          status = BinDeviceStatus.offline; // หรือใช้ maintenance/อื่น ๆ ตามต้องการ
          // ถ้าต้องการ severity critical ให้สร้าง alert ด้วย
        } else if (fill >= 80 || battery < 3.6 || temp >= 40) {
          status = BinDeviceStatus.maintenance; // ใช้เป็น warning ใน schema นี้อาจ mapping ตามต้องการ
        } else {
          status = BinDeviceStatus.active;
        }

        await this.prisma.smartBin.update({
          where: { id: bin.id },
          data: {
            last_heartbeat: now,
            status,
          },
        });

        // ลบ alert เก่า (ถ้าต้องการให้แสดงแค่รอบปัจจุบัน)
        await this.prisma.alert.deleteMany({
          where: { binId: bin.id },
        });

        // สร้าง alert จากกฎของรอบนี้ (ใช้ enum values ที่ schema กำหนด)
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

        // ควบคุมให้ sensor records เหลือไม่เกิน 50
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

        // ลบ alert เก่าเกินจำกัด (เก็บ 20 ล่าสุด)
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

    }, 10_000); // ทุก 10 วินาที
  }
}
