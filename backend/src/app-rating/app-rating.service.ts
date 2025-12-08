import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppRatingDto } from './create-app-rating.dto';

@Injectable()
export class AppRatingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAppRatingDto) {
    // sanitize defaults
    const data = {
      device_uuid: dto.device_uuid ?? null,
      rating: dto.rating,
      comment: dto.comment ?? null,
      app_version: dto.app_version ?? null,
      platform: dto.platform ?? 'web',
      device_info: dto.device_info ?? null,
    };
    return this.prisma.appRating.create({ data });
  }

  async findAll(device_uuid?: string) {
    return this.prisma.appRating.findMany({
      where: device_uuid ? { device_uuid } : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  async summary() {
    const agg = await this.prisma.appRating.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
    });

    // counts per rating 1..5
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      const c = await this.prisma.appRating.count({ where: { rating: i } });
      counts[i] = c;
    }

    return {
      avg: agg._avg.rating ?? 0,
      total: agg._count.rating ?? 0,
      distribution: counts,
    };
  }
}
