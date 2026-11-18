import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from '../../database/entities';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
  ) {}

  async findAll() {
    return this.uploadRepository.find();
  }
}
