import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { AssignTaskDto } from "./dto/assign-task.dto";
import { CompleteTaskItemDto } from "./dto/complete-task-item.dto";
import { ReportIssueDto } from "./dto/report-issue.dto";
import { IssueType } from "@prisma/client";
@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------------------------------
  // CREATE TASK (เวอร์ชันแก้ bin_code 100% ทำงานชัวร์)
  // ----------------------------------------------------
  async createTask(dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        created_by: dto.created_by,
        notes: dto.notes ?? null,
        priority: dto.priority ?? "medium",
        status: "pending",

        items: {
          create: dto.bin_ids.map((binCode, index) => ({
            order: index + 1,
            status: "pending",
            bin: { connect: { bin_code: binCode } }, // แก้ตรงนี้
          })),
        },
      },
      include: { items: true },
    });
  }

  // ----------------------------------------------------
  // GET ALL TASKS
  // ----------------------------------------------------
  async getAllTasks() {
    return this.prisma.task.findMany({
      include: {
        items: {
          include: { bin: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
  }

  // ----------------------------------------------------
  // GET ONE TASK
  // ----------------------------------------------------
  async getTask(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        items: {
          include: { bin: true },
        },
      },
    });
  }

  // ----------------------------------------------------
  // ASSIGN TASK TO COLLECTOR
  // ----------------------------------------------------
  async assignTask(id: string, dto: AssignTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: {
        assigned_to: dto.assigned_to,
        assigned_at: new Date(),
        status: "in_progress",
      },
    });
  }

  // ----------------------------------------------------
  // GET TODAY TASKS
  // ----------------------------------------------------
  async getTodayTasks() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return this.prisma.task.findMany({
      where: {
        created_at: { gte: start, lte: end },
      },
      include: {
        items: {
          include: { bin: true },
        },
      },
    });
  }

  // ----------------------------------------------------
  // START TASK
  // ----------------------------------------------------
  async startTask(id: string) {
    return this.prisma.task.update({
      where: { id },
      data: { status: "in_progress" },
    });
  }

  // ----------------------------------------------------
  // COMPLETE TASK ITEM
  // ----------------------------------------------------
  // ----------------------------------------------------
  // COMPLETE TASK ITEM (Auto complete task)
  // ----------------------------------------------------
  async completeTaskItem(id: string, dto: CompleteTaskItemDto) {
    // 1) update this item
    const updated = await this.prisma.taskItem.update({
      where: { id },
      data: {
        status: "completed",
        completed_at: new Date(),
        gps_lat: dto.gps_lat ?? null,
        gps_lng: dto.gps_lng ?? null,
        collector_note: dto.collector_note ?? null,
      },
    });

    const taskId = updated.task_id;

    // 2) check all items in this task
    const items = await this.prisma.taskItem.findMany({
      where: { task_id: taskId },
    });

    const total = items.length;
    const completed = items.filter((i) => i.status === "completed").length;

    // 3) update task status accordingly
    if (completed === total) {
      await this.prisma.task.update({
        where: { id: taskId },
        data: {
          status: "completed",
          completed_at: new Date(),
        },
      });
    } else {
      await this.prisma.task.update({
        where: { id: taskId },
        data: { status: "in_progress" },
      });
    }

    return { success: true };
  }

  // ----------------------------------------------------
  // REPORT ISSUE
  // ----------------------------------------------------
async reportIssue(taskItemId: string, dto: ReportIssueDto) {
  return this.prisma.issueReport.create({
    data: {
      task_item_id: taskItemId,
      bin_id: dto.bin_id,
      reporter_id: null,
      description: dto.description ?? null,
      issue_type: dto.issue_type as IssueType,
      created_at: new Date(),
    },
  });
}

  async completeAllItems(taskId: string) {
  // 1) complete ทุก item
  await this.prisma.taskItem.updateMany({
    where: { task_id: taskId, status: { not: 'completed' } },
    data: {
      status: 'completed',
      completed_at: new Date(),
    },
  });

  // 2) update task = completed
  return this.prisma.task.update({
    where: { id: taskId },
    data: {
      status: 'completed',
      completed_at: new Date(),
    },
    include: {
      items: true,
    },
  });
}

// DELETE TASK (🟢 เพิ่มฟังก์ชันนี้)
  // ----------------------------------------------------
  async deleteTask(id: string) {
    // ใช้ Transaction เพื่อความชัวร์: ลบรายการย่อย (Items) ก่อน แล้วค่อยลบงานหลัก (Task)
    const deleteItems = this.prisma.taskItem.deleteMany({
      where: { task_id: id }, // ตรวจสอบ field ใน schema ว่าใช้ task_id หรือ taskId
    });

    const deleteTask = this.prisma.task.delete({
      where: { id },
    });
    return await this.prisma.$transaction([deleteItems, deleteTask]);
  }
}
