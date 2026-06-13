import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Product,
  ProductDocument,
  ProductStatus,
} from './schemas/product.schema';

import {
  Upload,
  UploadDocument,
  EntityType,
} from '../uploads/schemas/upload.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,

    @InjectModel(Upload.name)
    private uploadModel: Model<UploadDocument>,
  ) {}

  async findAll() {
    const products = await this.productModel
      .find({ status: ProductStatus.ACTIVE })
      .populate('category_id')
      .sort({ _id: -1 })
      .lean();

    const uploads = await this.uploadModel.find({
      entity_type: 'PRODUCT',
    });

    const uploadMap = new Map<string, string>();

    uploads.forEach((upload) => {
      const key = upload.entity_id.toString();

      // chỉ lấy ảnh đầu tiên làm thumbnail
      if (!uploadMap.has(key)) {
        uploadMap.set(key, upload.url);
      }
    });

    return products.map((product) => {
      return {
        ...product,
        image: uploadMap.get(product._id.toString()) || null,
      };
    });
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('category_id')
      .lean();

    if (!product) {
      return null;
    }

    const uploads = await this.uploadModel.find({
      entity_type: EntityType.PRODUCT,
      entity_id: product._id,
    });

    return {
      ...product,
      image: uploads[0]?.url || null,
      images: uploads.map((item) => item.url),
    };
  }
}
