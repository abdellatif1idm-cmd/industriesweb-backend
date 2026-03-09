import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Créer une nouvelle soumission.
   * Utilisé par tous les formulaires publics :
   * contact, vip, sponsoring (gold/platinum/...), stand
   */
  async create(dto: CreateSubmissionDto) {
    const submission = await this.prisma.submission.create({
      data: dto,
    });

    return {
      success: true,
      message: 'Votre soumission a été envoyée avec succès',
      data: {
        id: submission.id,
        createdAt: submission.createdAt,
      },
    };
  }
}
