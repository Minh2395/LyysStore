import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name)
    private readonly storeModel: Model<StoreDocument>,
  ) {}

  // CREATE STORE
  async create(createStoreDto: CreateStoreDto) {
    const store = new this.storeModel(createStoreDto);
    return await store.save();
  }

  // GET ALL STORES (active only)
  async findAll() {
    return await this.storeModel
      .find({ is_active: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  // GET ONE STORE
  async findOne(id: string) {
    return await this.storeModel.findById(id).exec();
  }

  // UPDATE STORE
  async update(id: string, updateStoreDto: UpdateStoreDto) {
    return await this.storeModel.findByIdAndUpdate(id, updateStoreDto, {
      new: true,
    });
  }

  // SOFT DELETE STORE
  async remove(id: string) {
    return await this.storeModel.findByIdAndUpdate(
      id,
      { is_active: false },
      { new: true },
    );
  }
}
