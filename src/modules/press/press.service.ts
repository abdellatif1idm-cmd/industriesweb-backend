import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePressAccreditationDto } from './dto/create-press-accreditation.dto';
import { uploadPdf } from './utils/cloudinary-pdf.upload';
import { uploadImageAsWebp } from './utils/cloudinary-image.upload';

@Injectable()
export class PressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePressAccreditationDto, file?: Express.Multer.File) {
    let pressCardUrl: string | undefined;

    if (file) {
      const isPdf = file.mimetype === 'application/pdf';
      const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(
        file.mimetype,
      );

      if (isPdf) {
        pressCardUrl = await uploadPdf(file, 'press-accreditations');
      } else if (isImage) {
        pressCardUrl = await uploadImageAsWebp(file, 'press-accreditations');
      }
    }

    const accreditation = await this.prisma.pressAccreditation.create({
      data: {
        source: dto.source,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        media: dto.media,
        fonction: dto.fonction,
        website: dto.website,
        coverage: dto.coverage,
        interview: dto.interview,
        pressCardUrl: pressCardUrl ?? null,
      },
    });

    return {
      success: true,
      message: "Votre demande d'accréditation a été envoyée avec succès",
      data: {
        id: accreditation.id,
        createdAt: accreditation.createdAt,
      },
    };
  }
}
