import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PressService } from './press.service';
import { CreatePressAccreditationDto } from './dto/create-press-accreditation.dto';

@ApiTags('Press')
@Controller('press-accreditation')
export class PressController {
  constructor(private readonly pressService: PressService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('pressCard', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
      fileFilter: (req, file, cb) => {
        // Accepte PDF, JPG, PNG
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error('Format non supporté — PDF, JPG, PNG uniquement'),
            false,
          );
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: "Soumettre une demande d'accréditation presse (public)",
  })
  @ApiResponse({ status: 201, description: 'Demande envoyée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    // Debug — voir ce que Multer reçoit
    console.log('file mimetype:', file?.mimetype);
    console.log('file originalname:', file?.originalname);
    console.log('file size:', file?.size);
    // Parser les champs JSON du multipart
    const dto: CreatePressAccreditationDto = {
      ...body,
      coverage: JSON.parse(body.coverage ?? '[]'),
      interview: body.interview === 'true',
    };

    return this.pressService.create(dto, file);
  }
}
