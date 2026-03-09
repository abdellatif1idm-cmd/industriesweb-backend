import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum PressFunction {
  JOURNALISTE = 'Journaliste',
  PHOTOGRAPHE = 'Photographe',
  REPORTER_VIDEO = 'Reporter video',
  REDACTEUR = 'Rédacteur.rice',
  INGENIEUR_SON = 'Ingénieur son',
  AUTRE = 'Autre',
}

export enum CoverageType {
  ARTICLE = 'Article de presse',
  REPORTAGE_TV = 'Reportage TV',
  INTERVIEW = 'Interview',
  SITE_WEB = 'Diffusion sur site web',
  RESEAUX = 'Réseaux sociaux',
  GLOBALE = 'Couverture globale',
}

export class CreatePressAccreditationDto {
  @ApiProperty({ example: 'PLANT MANAGER MEETING' })
  @IsString()
  source: string;

  @ApiProperty({ example: 'Jean' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'jean@media.com' })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({ example: '+212600000000' })
  @IsString()
  @MinLength(6)
  phone: string;

  @ApiProperty({ example: 'Le Monde' })
  @IsString()
  media: string;

  @ApiProperty({ enum: PressFunction })
  @IsEnum(PressFunction, { message: 'Fonction invalide' })
  fonction: PressFunction;

  @ApiPropertyOptional({ example: 'https://lemonde.fr' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ enum: CoverageType, isArray: true })
  @IsArray()
  @IsEnum(CoverageType, { each: true, message: 'Type de couverture invalide' })
  coverage: CoverageType[];

  @ApiProperty({ example: true })
  @IsBoolean()
  interview: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pressCardUrl?: string;
}
