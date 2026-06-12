import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from '../../decorator/customize';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Public()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
