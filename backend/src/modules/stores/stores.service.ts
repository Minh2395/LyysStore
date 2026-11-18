import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../../database/entities';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  // CREATE STORE
  async create(createStoreDto: CreateStoreDto) {
    const store = this.storeRepository.create(createStoreDto);
    return this.storeRepository.save(store);
  }

  // GET ALL STORES (active only)
  async findAll() {
    return this.storeRepository.find({
      where: { is_active: true },
      order: { createdAt: 'DESC' },
    });
  }

  // GET ONE STORE
  async findOne(id: string) {
    return this.storeRepository.findOneBy({ _id: id });
  }

  // UPDATE STORE
  async update(id: string, updateStoreDto: UpdateStoreDto) {
    await this.storeRepository.update({ _id: id }, updateStoreDto);
    return this.findOne(id);
  }

  // SOFT DELETE STORE
  async remove(id: string) {
    await this.storeRepository.update({ _id: id }, { is_active: false });
    return this.findOne(id);
  }
}
