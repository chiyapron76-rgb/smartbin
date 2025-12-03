import {
  PrismaClient,
  BinDeviceStatus,
  BinStatus,
  AlertType,
  AlertSeverity,
  CitizenIssueType,
  CitizenReportStatus,
  TaskStatus,
  TaskPriority,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing previous data...");
  await prisma.issueReport.deleteMany();
  await prisma.citizenReport.deleteMany();
  await prisma.taskItem.deleteMany();
  await prisma.task.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.sensorRecord.deleteMany();
  await prisma.bin.deleteMany();
  await prisma.smartBin.deleteMany();

  console.log("Creating SmartBins...");
  const smartbins = [];

  for (let i = 1; i <= 10; i++) {
    const sb = await prisma.smartBin.create({
      data: {
        bin_code: `BIN-${String(i).padStart(3, "0")}`,
        model: "SB-100",
        sensor_type: "ultrasonic",
        location_lat: 13.7563 + Math.random() * 0.01,
        location_lng: 100.5018 + Math.random() * 0.01,
        zone: ["A", "B", "C"][Math.floor(Math.random() * 3)],
        status: [BinDeviceStatus.active, BinDeviceStatus.maintenance, BinDeviceStatus.offline][
          Math.floor(Math.random() * 3)
        ],
        firmware_version: ["1.0.0", "1.0.1", "1.1.0"][Math.floor(Math.random() * 3)],
        network_type: ["wifi", "lte", "nb-iot"][Math.floor(Math.random() * 3)],
        is_online: Math.random() > 0.3,
        last_heartbeat: new Date(Date.now() - Math.random() * 3600000),
      },
    });

    smartbins.push(sb);
  }

  console.log("Creating SensorRecords for 7-day trends...");
  for (const sb of smartbins) {
    for (let d = 6; d >= 0; d--) {
      const t = new Date();
      t.setDate(t.getDate() - d);
      t.setHours(12, 0, 0, 0);

      await prisma.sensorRecord.create({
        data: {
          binId: sb.id,
          distance_cm: Math.floor(Math.random() * 100),
          fill_percentage: Math.floor(Math.random() * 100),
          battery_voltage: 3.2 + Math.random() * 1,
          temperature: 25 + Math.random() * 15,
          timestamp: t,
        },
      });
    }
  }

  console.log("Creating Bin mapping...");
  for (const sb of smartbins) {
    await prisma.bin.create({
      data: {
        bin_code: sb.bin_code,
        device_id: sb.id,
        name: sb.bin_code,
        area: sb.zone ?? "A",
        capacity: 100,
        latitude: sb.location_lat,
        longitude: sb.location_lng,
        installed_at: new Date(),
        status: [BinStatus.normal, BinStatus.warning, BinStatus.full][
          Math.floor(Math.random() * 3)
        ],
      },
    });
  }

  console.log("Creating Alerts...");
  for (const sb of smartbins) {
    await prisma.alert.create({
      data: {
        binId: sb.id,
        alert_type: ["full", "high_temp", "low_battery"][Math.floor(Math.random() * 3)] as AlertType,
        message: "Auto-generated alert",
        severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as AlertSeverity,
      },
    });
  }

  console.log("Creating Citizen Reports...");
  for (const sb of smartbins.slice(0, 4)) {
    const bin = await prisma.bin.findFirst({
      where: { bin_code: sb.bin_code },
    });

    if (bin) {
      await prisma.citizenReport.create({
        data: {
          bin_id: bin.id,
          issue_type: CitizenIssueType.full,
          description: "Citizen report: bin full",
          status: CitizenReportStatus.open,
        },
      });
    }
  }

  console.log("Creating Tasks...");
  const task = await prisma.task.create({
    data: {
      created_by: "system",
      status: TaskStatus.in_progress,
      priority: TaskPriority.medium,
    },
  });

  console.log("Creating TaskItems...");
  for (let idx = 0; idx < 5; idx++) {
    const sb = smartbins[idx];

    const bin = await prisma.bin.findFirst({
      where: { bin_code: sb.bin_code },
    });

    if (bin) {
      await prisma.taskItem.create({
        data: {
          task_id: task.id,
          bin_id: bin.id,
          order: idx + 1,
        },
      });
    }
  }

  console.log("SEED DONE!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
