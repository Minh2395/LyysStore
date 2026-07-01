import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CartsService } from './carts.service';

import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { RemoveCartItemsDto } from './dto/remove-cart.dto';

import { JwtAuthGuard } from '../../auth/passport/jwt-auth.guard';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // ======================
  // ADD TO CART
  // ======================
  @Post('add')
  @UseGuards(JwtAuthGuard)
  addToCart(@Req() req, @Body() dto: AddCartDto) {
    return this.cartsService.addToCart(req.user._id, dto);
  }

  // ======================
  // GET CART
  // ======================
  @Get()
  @UseGuards(JwtAuthGuard)
  getCart(@Req() req) {
    return this.cartsService.getCart(req.user._id);
  }

  // ======================
  // UPDATE QUANTITY
  // ======================
  @Patch('items/:productId')
  @UseGuards(JwtAuthGuard)
  updateQuantity(
    @Req() req,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateQuantity(req.user._id, productId, dto);
  }

  // ======================
  // REMOVE ONE ITEM
  // ======================
  @Delete('items/:productId')
  @UseGuards(JwtAuthGuard)
  removeItem(@Req() req, @Param('productId') productId: string) {
    return this.cartsService.removeItem(req.user._id, productId);
  }

  // ======================
  // REMOVE MANY ITEMS
  // ======================
  @Delete('items')
  @UseGuards(JwtAuthGuard)
  removeMany(@Req() req, @Body() dto: RemoveCartItemsDto) {
    return this.cartsService.removeMany(req.user._id, dto);
  }
}
