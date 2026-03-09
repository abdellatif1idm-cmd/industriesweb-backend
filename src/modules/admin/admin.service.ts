import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────
  // SUBMISSIONS
  // ─────────────────────────────────────────

  async getSubmissions(
    page = 1,
    limit = 20,
    source?: string,
    plan?: string,
    type?: string,
  ) {
    const skip = (page - 1) * limit;
    const where = {
      ...(source && { source }),
      ...(plan && { plan }),
      ...(type && { type }),
    };

    const [data, total] = await Promise.all([
      this.prisma.submission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.submission.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSubmissionById(id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
    });
    if (!submission)
      throw new NotFoundException(`Soumission #${id} introuvable`);
    return submission;
  }

  async markAsRead(id: string) {
    await this.getSubmissionById(id);
    return this.prisma.submission.update({
      where: { id },
      data: { read: true },
    });
  }

  async getStats() {
    const [stats, bySourceSubmissions, byPlanSubmissions, bySourcePress] =
      await Promise.all([
        // ✅ Query propre via Prisma Client — plus de $queryRaw
        this.prisma.stats_view.findFirst(),

        this.prisma.submission.groupBy({
          by: ['source'],
          _count: { source: true },
        }),
        this.prisma.submission.groupBy({
          by: ['plan', 'type'],
          _count: { plan: true },
        }),
        this.prisma.pressAccreditation.groupBy({
          by: ['source'],
          _count: { source: true },
        }),
      ]);

    return {
      submissions: {
        total: Number(stats?.submissions_total ?? 0),
        unread: Number(stats?.submissions_unread ?? 0),
        bySource: bySourceSubmissions.map((s) => ({
          source: s.source,
          count: s._count.source,
        })),
        byPlan: byPlanSubmissions.map((p) => ({
          plan: p.plan,
          type: p.type,
          count: p._count.plan,
        })),
      },
      press: {
        total: Number(stats?.press_total ?? 0),
        unread: Number(stats?.press_unread ?? 0),
        pending: Number(stats?.press_pending ?? 0),
        approved: Number(stats?.press_approved ?? 0),
        rejected: Number(stats?.press_rejected ?? 0),
        bySource: bySourcePress.map((s) => ({
          source: s.source,
          count: s._count.source,
        })),
      },
    };
  }

  // ─────────────────────────────────────────
  // PRESS ACCREDITATIONS
  // ─────────────────────────────────────────

  async getPressAccreditations(
    page = 1,
    limit = 20,
    source?: string,
    status?: string,
  ) {
    const skip = (page - 1) * limit;
    const where = {
      ...(source && { source }),
      ...(status && { status }),
    };

    const [data, total] = await Promise.all([
      this.prisma.pressAccreditation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.pressAccreditation.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPressAccreditationById(id: string) {
    const accreditation = await this.prisma.pressAccreditation.findUnique({
      where: { id },
    });
    if (!accreditation)
      throw new NotFoundException(`Accréditation #${id} introuvable`);
    return accreditation;
  }

  async updatePressStatus(id: string, status: string) {
    await this.getPressAccreditationById(id);
    return this.prisma.pressAccreditation.update({
      where: { id },
      data: { status },
    });
  }

  async markPressAsRead(id: string) {
    await this.getPressAccreditationById(id);
    return this.prisma.pressAccreditation.update({
      where: { id },
      data: { read: true },
    });
  }
}
