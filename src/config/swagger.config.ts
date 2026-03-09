import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Swagger — Documentation interactive sur /api/docs.
 *
 * Le bouton "Authorize" permet de tester les routes JWT
 * directement depuis le navigateur sans Postman.
 */
export function swaggerConfig(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Submission  API')
    .setDescription(
      `
      API centralisée pour recevoir et consulter les formulaires de Submission .

      **Routes publiques** (pas de token) :
      - POST /api/v1/Submission
      - POST /api/v1/auth/login

      **Routes privées** (JWT Bearer requis) :
      - GET  /api/v1/admin/Submissions
      - GET  /api/v1/admin/stats
      - PATCH /api/v1/admin/Submissions/:id/read

      Pour tester les routes privées : cliquer sur **Authorize** et coller le token.
    `,
    )
    .setVersion('1.0.0')
    .addTag('Submission', 'Soumission publique des formulaires')
    .addTag('auth', 'Authentification admin')
    .addTag('admin', 'Consultation des données (JWT requis)')
    // Active le bouton "Authorize" dans Swagger UI
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Garder le token entre les refreshs
    },
    customSiteTitle: 'Submission API — Docs',
  });
}
