import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: any) {
    return await this.categoryModel.create({
      ...createCategoryDto,
      created_by: user._id,
    });
  }

  async findAll() {
    return await this.categoryModel
      .find()
      .populate('parent_id', 'name')
      .sort({ sort_order: 1 });
  }

  async findOne(id: string) {
    const category = await this.categoryModel
      .findById(id)
      .populate('parent_id', 'name');

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  // ======================
  // UPDATE CATEGORY
  // ======================
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      {
        new: true,
      },
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      message: 'Updated successfully',
      data: category,
    };
  }

  // ======================
  // HARD DELETE
  // ======================
  async remove(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      success: true,
      message: 'Category deleted successfully',
      data: {
        _id: id,
      },
    };
  }
}
