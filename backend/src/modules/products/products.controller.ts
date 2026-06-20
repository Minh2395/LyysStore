import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Public } from '../../decorator/customize';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Public()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('material/:slug')
  @Public()
  findByCategorySlug(@Param('slug') slug: string) {
    return this.productsService.findByCategorySlug(slug);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request & { user: any },
  ) {
    return this.productsService.create(createProductDto, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request & { user: any },
  ) {
    return this.productsService.update(id, updateProductDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
