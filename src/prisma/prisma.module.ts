import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * @Global() → PrismaService disponible dans TOUS les modules
 * sans avoir à l'importer dans chaque module.module.ts
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
