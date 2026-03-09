import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─────────────────────────────────────────
  // SUBMISSIONS
  // ─────────────────────────────────────────

  @Get('submissions')
  @ApiOperation({ summary: 'Lister les soumissions (JWT requis)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'source', required: false, example: 'FMEC' })
  @ApiQuery({ name: 'plan', required: false, example: 'sponsoring' })
  @ApiQuery({ name: 'type', required: false, example: 'gold' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  getSubmissions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('source') source?: string,
    @Query('plan') plan?: string,
    @Query('type') type?: string,
  ) {
    return this.adminService.getSubmissions(page, limit, source, plan, type);
  }

  @Get('submissions/:id')
  @ApiOperation({ summary: "Détail d'une soumission (JWT requis)" })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 401 })
  getSubmissionById(@Param('id') id: string) {
    // ✅ Fix — plus de ParseIntPipe
    return this.adminService.getSubmissionById(id);
  }

  @Patch('submissions/:id/read')
  @ApiOperation({ summary: 'Marquer soumission comme lue (JWT requis)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 401 })
  markAsRead(@Param('id') id: string) {
    // ✅ Fix — plus de ParseIntPipe
    return this.adminService.markAsRead(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques globales (JWT requis)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  getStats() {
    return this.adminService.getStats();
  }

  // ─────────────────────────────────────────
  // PRESS ACCREDITATIONS
  // ─────────────────────────────────────────

  @Get('press-accreditations')
  @ApiOperation({ summary: 'Lister les accréditations presse (JWT requis)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({
    name: 'source',
    required: false,
    example: 'PLANT MANAGER MEETING',
  })
  @ApiQuery({ name: 'status', required: false, example: 'pending' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  getPressAccreditations(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('source') source?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getPressAccreditations(
      page,
      limit,
      source,
      status,
    );
  }

  @Get('press-accreditations/:id')
  @ApiOperation({ summary: "Détail d'une accréditation presse (JWT requis)" })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 401 })
  getPressAccreditationById(@Param('id') id: string) {
    return this.adminService.getPressAccreditationById(id);
  }

  @Patch('press-accreditations/:id/status')
  @ApiOperation({
    summary: "Changer le statut d'une accréditation (JWT requis)",
  })
  @ApiBody({
    schema: {
      example: { status: 'approved' },
      properties: {
        status: {
          type: 'string',
          enum: ['pending', 'approved', 'rejected'],
        },
      },
    },
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 401 })
  updatePressStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updatePressStatus(id, status);
  }

  @Patch('press-accreditations/:id/read')
  @ApiOperation({ summary: 'Marquer accréditation comme lue (JWT requis)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  @ApiResponse({ status: 401 })
  markPressAsRead(@Param('id') id: string) {
    return this.adminService.markPressAsRead(id);
  }
}
