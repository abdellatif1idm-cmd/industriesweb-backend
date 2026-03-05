import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt:    JwtService,
  ) {}

  async login(dto: LoginDto) {
    // 1. Chercher l'admin par email
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    // 2. Vérifier existence + mot de passe en une seule condition
    // ⚠️ Ne pas préciser si c'est l'email ou le password qui est faux
    //    → évite les attaques par énumération d'emails
    const isValid = admin && await bcrypt.compare(dto.password, admin.password);
    if (!isValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    this.logger.log(`🔐 Admin connecté : ${admin.email}`);

    // 3. Générer le token JWT
    // Le payload contient sub (id) et email — pas le mot de passe !
    const token = this.jwt.sign({ sub: admin.id, email: admin.email });

    return {
      access_token: token,
      token_type:   'Bearer',
      expires_in:   process.env.JWT_EXPIRES_IN ?? '7d',
    };
  }
}