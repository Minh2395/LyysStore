import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category, Product, Upload } from '../../database/entities';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { EntityType } from '../../database/entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
  ) {}

  // ======================
  // CREATE
  // ======================
  async create(createProductDto: CreateProductDto, user: { _id: string }) {
    const product = this.productRepository.create({
      ...createProductDto,
      name: createProductDto.name.trim(),
      slug: createProductDto.slug.trim(),
      created_by: user._id,
    });
    return this.productRepository.save(product);
  }

  // ======================
  // FIND ALL
  // ======================
  async findAll() {
    const products = await this.productRepository.find({
      order: { _id: 'DESC' },
    });
    const categories = await this.loadCategories(products);

    const uploads = await this.uploadRepository.find({
      where: { entity_type: EntityType.PRODUCT },
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
      category_id: this.categorySummary(categories.get(product.category_id)),
      image: uploadMap.get(product._id.toString()) || null,
    }));
  }

  // ======================
  // FIND ONE
  // ======================
  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ _id: id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const [category, uploads] = await Promise.all([
      this.categoryRepository.findOneBy({ _id: product.category_id }),
      this.uploadRepository.find({
        where: {
          entity_type: EntityType.PRODUCT,
          entity_id: product._id,
        },
      }),
    ]);

    return {
      ...product,
      category_id: this.categorySummary(category),
      image: uploads[0]?.url || null,
      images: uploads.map((item) => item.url),
    };
  }

  // ======================
  // UPDATE
  // ======================
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: { _id: string },
  ) {
    await this.productRepository.update(
      { _id: id },
      {
        ...updateProductDto,
        ...(updateProductDto.name && {
          name: updateProductDto.name.trim(),
        }),
        ...(updateProductDto.slug && {
          slug: updateProductDto.slug.trim(),
        }),
        updated_by: user._id,
      },
    );
    const product = await this.productRepository.findOneBy({ _id: id });

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
    const product = await this.productRepository.findOneBy({ _id: id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.remove(product);
    await this.uploadRepository.delete({
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
    const category = await this.categoryRepository.findOneBy({ slug });
    if (!category) {
      return [];
    }

    const products = await this.productRepository.findBy({
      category_id: category._id,
    });

    const uploads = await this.uploadRepository.find({
      where: { entity_type: EntityType.PRODUCT },
    });

    const uploadMap = new Map<string, string>();
    uploads.forEach((u) => {
      uploadMap.set(u.entity_id.toString(), u.url);
    });

    return products.map((p) => ({
      ...p,
      category_id: this.categorySummary(category),
      image: uploadMap.get(p._id.toString()) || null,
    }));
  }

  private async loadCategories(products: Product[]) {
    const categoryIds = [
      ...new Set(products.map((product) => product.category_id)),
    ];
    const categories = categoryIds.length
      ? await this.categoryRepository.findBy({ _id: In(categoryIds) })
      : [];
    return new Map(categories.map((category) => [category._id, category]));
  }

  private categorySummary(category?: Category | null) {
    return category
      ? { _id: category._id, name: category.name, slug: category.slug }
      : null;
  }
}
