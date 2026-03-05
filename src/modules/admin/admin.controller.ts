import {
  Controller, Get, Patch, Param, Query,
  ParseIntPipe, UseGuards, DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiOperation, ApiQuery,
  ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET /api/v1/admin/submissions
  @Get('submissions')
  @ApiOperation({ summary: 'Lister les soumissions (JWT requis)' })
  @ApiQuery({ name: 'page',   required: false, example: 1 })
  @ApiQuery({ name: 'limit',  required: false, example: 20 })
  @ApiQuery({ name: 'source', required: false, example: 'FMEC' })
  @ApiQuery({ name: 'plan',   required: false, example: 'sponsoring' })
  @ApiQuery({ name: 'type',   required: false, example: 'gold' })
  @ApiResponse({ status: 200, description: 'Liste paginée des soumissions' })
  @ApiResponse({ status: 401, description: 'Token JWT manquant ou invalide' })
  getSubmissions(
    @Query('page',  new DefaultValuePipe(1),  ParseIntPipe) page:  number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('source') source?: string,
    @Query('plan')   plan?:   string,
    @Query('type')   type?:   string,
  ) {
    return this.adminService.getSubmissions(page, limit, source, plan, type);
  }

  // GET /api/v1/admin/submissions/:id
  @Get('submissions/:id')
  @ApiOperation({ summary: 'Détail d\'une soumission (JWT requis)' })
  @ApiResponse({ status: 200, description: 'Soumission trouvée' })
  @ApiResponse({ status: 404, description: 'Soumission introuvable' })
  @ApiResponse({ status: 401, description: 'Token JWT manquant ou invalide' })
  getSubmissionById(@Param('id', ParseIntPipe) id: string) {
    return this.adminService.getSubmissionById(id);
  }

  // PATCH /api/v1/admin/submissions/:id/read
  @Patch('submissions/:id/read')
  @ApiOperation({ summary: 'Marquer comme lu (JWT requis)' })
  @ApiResponse({ status: 200, description: 'Soumission marquée comme lue' })
  @ApiResponse({ status: 404, description: 'Soumission introuvable' })
  @ApiResponse({ status: 401, description: 'Token JWT manquant ou invalide' })
  markAsRead(@Param('id', ParseIntPipe) id: string) {
    return this.adminService.markAsRead(id);
  }

  // GET /api/v1/admin/stats
  @Get('stats')
  @ApiOperation({ summary: 'Statistiques globales (JWT requis)' })
  @ApiResponse({ status: 200, description: 'Statistiques retournées' })
  @ApiResponse({ status: 401, description: 'Token JWT manquant ou invalide' })
  getStats() {
    return this.adminService.getStats();
  }
}