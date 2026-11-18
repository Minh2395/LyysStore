import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';

import { Cart, Product } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product])],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
