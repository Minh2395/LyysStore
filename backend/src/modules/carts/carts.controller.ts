import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { CartsService } from './carts.service';

import { AddCartDto } from './dto/add-cart.dto';
import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  addToCart(@Req() req, @Body() dto: AddCartDto) {
    return this.cartsService.addToCart(req.user._id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCart(@Req() req) {
    return this.cartsService.getCart(req.user._id);
  }
}
