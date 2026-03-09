import { INestApplication } from '@nestjs/common';

/**
 * CORS — Autorise uniquement les origines déclarées dans .env
 * à appeler cette API depuis le navigateur.
 *
 * ALLOWED_ORIGINS="http://localhost:3000,https://plant-manager.com"
 */
export function corsConfig(app: INestApplication): void {
  const rawOrigins = process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000';
  const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    // Authorization requis pour envoyer le token JWT depuis le backoffice
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
}
