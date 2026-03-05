import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSubmissionDto {
  // ── Identification ──────────────────────────────────────────
  // source : identifie l'application frontend
  @ApiProperty({ example: 'FMEC', description: 'Application source' })
  @IsString()
  source: string;

  // plan : type de formulaire soumis
  @ApiProperty({
    example:  'contact',
    enum:     ['contact', 'vip', 'sponsoring', 'stand'],
    description: 'Type de formulaire',
  })
  @IsIn(['contact', 'vip', 'sponsoring', 'stand'])
  plan: string;

  // type : sous-type du plan (optionnel pour contact)
  @ApiPropertyOptional({
    example: 'gold',
    description: 'gold | platinum | silver | prestige | officiel | stand-standard | stand-premium',
  })
  @IsOptional()
  @IsString()
  type?: string;

  // ── Champs communs à tous les formulaires ───────────────────
  @ApiProperty({ example: 'Jean' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'jean@email.com' })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  // ── Champs optionnels selon le formulaire ───────────────────
  // Contact, VIP, Stand, Sponsoring
  @ApiPropertyOptional({ example: '+212600000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  // VIP, Stand, Sponsoring
  @ApiPropertyOptional({ example: 'Directeur commercial' })
  @IsOptional()
  @IsString()
  fonction?: string;

  // VIP, Stand, Sponsoring
  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  entreprise?: string;

  // VIP, Stand, Sponsoring
  @ApiPropertyOptional({ example: 'Casablanca' })
  @IsOptional()
  @IsString()
  ville?: string;

  // Stand, Sponsoring
  @ApiPropertyOptional({ example: 'Maroc' })
  @IsOptional()
  @IsString()
  localisation?: string;

  // Sponsoring uniquement
  @ApiPropertyOptional({ example: 'Mohamed Alami' })
  @IsOptional()
  @IsString()
  interlocuteur?: string;

  // Contact uniquement
  @ApiPropertyOptional({ example: 'Bonjour je voudrais...' })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Message trop court' })
  message?: string;
}