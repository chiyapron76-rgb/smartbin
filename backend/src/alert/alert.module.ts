import { Module } from "@nestjs/common";
import { AlertService } from "./alert.service";
import { AlertController } from "./alert.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [AlertService, PrismaService],
  controllers: [AlertController],
})
export class AlertModule {}
