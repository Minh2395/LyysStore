import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  Product,
  ProductDocument,
  ProductStatus,
} from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async findAll() {
    return await this.productModel
      .find({
        status: ProductStatus.ACTIVE,
      })
      .populate('category_id')
      .sort({ _id: -1 });
  }

  async findOne(id: string) {
    return await this.productModel.findById(id).populate('category_id');
  }
}
