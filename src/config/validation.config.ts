import { INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * Validation globale — Active les décorateurs class-validator
 * (@IsEmail, @IsNotEmpty, etc.) sur tous les DTOs de l'app.
 *
 * Sans ce setup, les règles dans les DTOs sont complètement ignorées.
 */
export function validationConfig(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Supprimer les champs non déclarés dans le DTO
      forbidNonWhitelisted: true, // Retourner 400 si champs inconnus envoyés
      transform: true,            // Convertir les types automatiquement
      stopAtFirstError: false,    // Retourner TOUTES les erreurs
    }),
  );
}