import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Cart, CartItem, CartStatus, Product } from '../../database/entities';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { RemoveCartItemsDto } from './dto/remove-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToCart(userId: string, dto: AddCartDto) {
    const product = await this.productRepository.findOneBy({
      _id: dto.product_id,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cart = await this.cartRepository.findOneBy({
      user_id: userId,
      status: CartStatus.ACTIVE,
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user_id: userId,
        items: [],
        total_price: 0,
        total_quantity: 0,
        status: CartStatus.ACTIVE,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product_id === dto.product_id,
    );

    if (existingItem) {
      existingItem.quantity += dto.quantity;
    } else {
      cart.items.push({
        product_id: product._id,
        quantity: dto.quantity,
        price: product.base_price,
      });
    }

    cart.total_quantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    cart.total_price = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    cart = await this.cartRepository.save(cart);

    return this.populateProducts(cart);
  }

  async getCart(userId: string) {
    const cart = await this.cartRepository.findOneBy({
      user_id: userId,
      status: CartStatus.ACTIVE,
    });

    return cart ? this.populateProducts(cart) : null;
  }

  async updateQuantity(
    userId: string,
    productId: string,
    dto: UpdateCartItemDto,
  ) {
    const cart = await this.cartRepository.findOneBy({
      user_id: userId,
      status: CartStatus.ACTIVE,
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = cart.items.find((i) => i.product_id === productId);

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    item.quantity = dto.quantity;

    cart.total_quantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    cart.total_price = cart.items.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0,
    );

    await this.cartRepository.save(cart);

    return this.populateProducts(cart);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.cartRepository.findOneBy({
      user_id: userId,
      status: CartStatus.ACTIVE,
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items.filter((i) => i.product_id !== productId);

    cart.total_quantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    cart.total_price = cart.items.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0,
    );

    await this.cartRepository.save(cart);

    return this.populateProducts(cart);
  }

  async removeMany(userId: string, dto: RemoveCartItemsDto) {
    const cart = await this.cartRepository.findOneBy({
      user_id: userId,
      status: CartStatus.ACTIVE,
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items.filter(
      (i) => !dto.productIds.includes(i.product_id),
    );

    cart.total_quantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    cart.total_price = cart.items.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0,
    );

    await this.cartRepository.save(cart);

    return this.populateProducts(cart);
  }

  private async populateProducts(cart: Cart) {
    const productIds = [...new Set(cart.items.map((item) => item.product_id))];
    const products = productIds.length
      ? await this.productRepository.findBy({ _id: In(productIds) })
      : [];
    const productMap = new Map(
      products.map((product) => [
        product._id,
        {
          _id: product._id,
          name: product.name,
          base_price: product.base_price,
          slug: product.slug,
        },
      ]),
    );

    return {
      ...cart,
      items: cart.items.map((item: CartItem) => ({
        ...item,
        product_id: productMap.get(item.product_id) ?? null,
      })),
    };
  }
}
