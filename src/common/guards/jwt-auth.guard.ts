import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard — Protège les routes qui nécessitent un JWT valide.
 *
 * Sur un controller entier → protège tous ses endpoints :
 *   @UseGuards(JwtAuthGuard)
 *   @Controller('admin')
 *
 * Si le token est absent ou invalide → retourne 401 automatiquement.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}