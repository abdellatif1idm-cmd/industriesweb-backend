import { Module } from '@nestjs/common';
import { PressService } from './press.service';
import { PressController } from './press.controller';
import { cloudinaryConfig } from '../../config/cloudinary.config';

// Initialiser Cloudinary au démarrage du module
cloudinaryConfig();

@Module({
  controllers: [PressController],
  providers: [PressService],
})
export class PressModule {}
