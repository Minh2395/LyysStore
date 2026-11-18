import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { Category, Product, Upload } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Upload])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
