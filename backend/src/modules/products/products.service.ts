import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Product, ProductDocument } from './schemas/product.schema';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  // ======================
  // CREATE
  // ======================
  async create(createProductDto: CreateProductDto, user: any) {
    return await this.productModel.create({
      ...createProductDto,
      created_by: user._id,
    });
  }

  // ======================
  // FIND ALL
  // ======================
  async findAll() {
    const products = await this.productModel
      .find()
      .populate('category_id', 'name slug')
      .sort({ _id: -1 })
      .lean();

    const uploads = await this.uploadModel.find({
      entity_type: EntityType.PRODUCT,
    });

    const uploadMap = new Map<string, string>();

    uploads.forEach((upload) => {
      const key = upload.entity_id.toString();

      if (!uploadMap.has(key)) {
        uploadMap.set(key, upload.url);
      }
    });

    return products.map((product) => ({
      ...product,
      image: uploadMap.get(product._id.toString()) || null,
    }));
  }

  // ======================
  // FIND ONE
  // ======================
  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('category_id', 'name slug')
      .lean();

    if (!product) {
      throw new NotFoundException('Product not found');
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

  // ======================
  // UPDATE
  // ======================
  async update(id: string, updateProductDto: UpdateProductDto, user: any) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      {
        ...updateProductDto,
        updated_by: user._id,
      },
      {
        new: true,
      },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      message: 'Updated successfully',
      data: product,
    };
  }

  // ======================
  // HARD DELETE
  // ======================
  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.uploadModel.deleteMany({
      entity_type: EntityType.PRODUCT,
      entity_id: product._id,
    });

    return {
      success: true,
      message: 'Product deleted successfully',
      data: {
        _id: id,
      },
    };
  }

  // ======================
  // FIND BY CATEGORY
  // ======================
  async findByCategorySlug(slug: string) {
    const products = await this.productModel
      .find()
      .populate({
        path: 'category_id',
        match: { slug },
      })
      .lean();

    const uploads = await this.uploadModel.find({
      entity_type: EntityType.PRODUCT,
    });

    const uploadMap = new Map<string, string>();
    uploads.forEach((u) => {
      uploadMap.set(u.entity_id.toString(), u.url);
    });

    return products
      .filter((p) => p.category_id)
      .map((p) => ({
        ...p,
        image: uploadMap.get(p._id.toString()) || null,
      }));
  }
}
