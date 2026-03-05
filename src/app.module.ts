import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { SubmissionModule } from './modules/submission/submission.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Variables .env globales
    PrismaModule,   // BDD globale
    SubmissionModule,  // POST /api/v1/contact      (public)
    AuthModule,     // POST /api/v1/auth/login   (public)
    AdminModule,    // GET  /api/v1/admin/**     (JWT requis)
  ],
})
export class AppModule {}