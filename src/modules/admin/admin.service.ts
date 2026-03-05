import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lister les soumissions avec pagination et filtres optionnels.
   * Filtres disponibles : source, plan, type
   */
  async getSubmissions(
    page   = 1,
    limit  = 20,
    source?: string,
    plan?:   string,
    type?:   string,
  ) {
    const skip  = (page - 1) * limit;
    const where = {
      ...(source && { source }),
      ...(plan   && { plan   }),
      ...(type   && { type   }),
    };

    const [data, total] = await Promise.all([
      this.prisma.submission.findMany({
        where,
        skip,
        take:    limit,
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

  /**
   * Récupérer une soumission par son ID.
   */
  async getSubmissionById(id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
    });

    if (!submission) throw new NotFoundException(`Soumission #${id} introuvable`);

    return submission;
  }

  /**
   * Marquer une soumission comme lue.
   */
  async markAsRead(id: string) {
    await this.getSubmissionById(id); // Vérifie que la soumission existe

    return this.prisma.submission.update({
      where: { id },
      data:  { read: true },
    });
  }

  /**
   * Statistiques globales :
   * total, non lus, répartition par source et par plan/type
   */
  async getStats() {
    const [total, unread, bySource, byPlan] = await Promise.all([
      this.prisma.submission.count(),
      this.prisma.submission.count({ where: { read: false } }),
      this.prisma.submission.groupBy({
        by:     ['source'],
        _count: { source: true },
      }),
      this.prisma.submission.groupBy({
        by:     ['plan', 'type'],
        _count: { plan: true },
      }),
    ]);

    return {
      total,
      unread,
      bySource: bySource.map(s => ({
        source: s.source,
        count:  s._count.source,
      })),
      byPlan: byPlan.map(p => ({
        plan:  p.plan,
        type:  p.type,
        count: p._count.plan,
      })),
    };
  }
}