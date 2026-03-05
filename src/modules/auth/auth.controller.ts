import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' }) // → /api/v1/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/v1/auth/login
   * Route PUBLIQUE — Connexion admin, retourne un token JWT.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion admin — retourne un token JWT' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        token_type:   'Bearer',
        expires_in:   '7d',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}