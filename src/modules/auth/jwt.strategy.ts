import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * JwtStrategy — Valide le token JWT sur chaque requête protégée.
 *
 * Flux :
 * 1. Requête arrive avec : Authorization: Bearer <token>
 * 2. passport-jwt extrait et vérifie avec JWT_SECRET
 * 3. validate() est appelé avec le payload décodé
 * 4. Retourne l'admin → accessible via @Request() req.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      // Lire le token depuis le header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'secret',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // Vérifier que l'admin existe toujours en BDD
    // (protection si le compte est supprimé après émission du token)
    const admin = await this.prisma.admin.findUnique({
      where: { id: payload.sub },
    });

    if (!admin) {
      throw new UnauthorizedException('Compte admin introuvable');
    }

    return { id: admin.id, email: admin.email };
  }
}