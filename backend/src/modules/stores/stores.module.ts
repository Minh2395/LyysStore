import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';

import { Store } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService], // optional: nếu module khác cần dùng
})
export class StoresModule {}
