import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Cart, CartDocument, CartStatus } from './schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { AddCartDto } from './dto/add-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: Model<CartDocument>,

    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async addToCart(userId: string, dto: AddCartDto) {
    const product = await this.productModel.findById(dto.product_id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cart = await this.cartModel.findOne({
      user_id: userId,
      status: CartStatus.ACTIVE,
    });

    if (!cart) {
      cart = await this.cartModel.create({
        user_id: userId,
        items: [],
        total_price: 0,
        total_quantity: 0,
        status: CartStatus.ACTIVE,
      });
    }

    const existingItem = cart.items.find(
      (item: any) => item.product_id.toString() === dto.product_id,
    );

    if (existingItem) {
      existingItem.quantity += dto.quantity;
    } else {
      cart.items.push({
        product_id: product._id,
        quantity: dto.quantity,
        price: product.base_price,
      } as any);
    }

    cart.total_quantity = cart.items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0,
    );

    cart.total_price = cart.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.price,
      0,
    );

    await cart.save();

    return this.cartModel.findById(cart._id).populate({
      path: 'items.product_id',
      select: 'name base_price slug',
    });
  }

  async getCart(userId: string) {
    const cart = await this.cartModel
      .findOne({
        user_id: userId,
        status: CartStatus.ACTIVE,
      })
      .populate({
        path: 'items.product_id',
        select: 'name base_price slug',
      });

    return cart;
  }
}
