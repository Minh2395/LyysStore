import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../../database/entities';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: { _id: string }) {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      name: createCategoryDto.name.trim(),
      slug: createCategoryDto.slug.trim(),
      created_by: user._id,
    });
    return this.categoryRepository.save(category);
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      order: { sort_order: 'ASC' },
    });
    return this.populateParentNames(categories);
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOneBy({ _id: id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return (await this.populateParentNames([category]))[0];
  }

  // ======================
  // UPDATE CATEGORY
  // ======================
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(
      { _id: id },
      {
        ...updateCategoryDto,
        ...(updateCategoryDto.name && {
          name: updateCategoryDto.name.trim(),
        }),
        ...(updateCategoryDto.slug && {
          slug: updateCategoryDto.slug.trim(),
        }),
      },
    );
    const category = await this.categoryRepository.findOneBy({ _id: id });

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
    const category = await this.categoryRepository.findOneBy({ _id: id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.remove(category);

    return {
      success: true,
      message: 'Category deleted successfully',
      data: {
        _id: id,
      },
    };
  }

  private async populateParentNames(categories: Category[]) {
    const parentIds = [
      ...new Set(
        categories
          .map((category) => category.parent_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ];
    const parents = parentIds.length
      ? await this.categoryRepository.findBy({ _id: In(parentIds) })
      : [];
    const parentMap = new Map(
      parents.map((parent) => [
        parent._id,
        { _id: parent._id, name: parent.name },
      ]),
    );

    return categories.map((category) => ({
      ...category,
      parent_id: parentMap.get(category.parent_id) ?? category.parent_id,
    }));
  }
}
