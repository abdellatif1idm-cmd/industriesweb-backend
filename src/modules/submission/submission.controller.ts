import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

// Route publique — pas de JWT requis
// POST /api/v1/submission
@ApiTags('Submission')
@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @ApiOperation({ summary: 'Soumettre un formulaire (public — pas de JWT)' })
  @ApiResponse({ status: 201, description: 'Soumission envoyée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissionService.create(dto);
  }
}