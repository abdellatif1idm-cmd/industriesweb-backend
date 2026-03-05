import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { validationConfig } from './config/validation.config';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global → toutes les routes commencent par /api/v1
  app.setGlobalPrefix('api/v1');

  // CORS → origines autorisées depuis .env
  corsConfig(app);

  // Validation globale des DTOs
  validationConfig(app);

  // Swagger UI → /api/docs
  swaggerConfig(app);

  await app.listen(process.env.PORT ?? 8080);
  console.log(`🚀 API     : http://localhost:${process.env.PORT ?? 8080}/api/v1`);
  console.log(`📚 Swagger : http://localhost:${process.env.PORT ?? 8080}/api/docs`);
}
bootstrap();