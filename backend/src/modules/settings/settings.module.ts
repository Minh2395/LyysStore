import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Setting, Upload } from '../../database/entities';

import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting, Upload])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
