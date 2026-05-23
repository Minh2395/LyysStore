import { Injectable } from '@nestjs/common';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';

@Injectable()
export class WarrantyService {
  create(createWarrantyDto: CreateWarrantyDto) {
    return 'This action adds a new warranty';
  }

  findAll() {
    return `This action returns all warranty`;
  }

  findOne(id: number) {
    return `This action returns a #${id} warranty`;
  }

  update(id: number, updateWarrantyDto: UpdateWarrantyDto) {
    return `This action updates a #${id} warranty`;
  }

  remove(id: number) {
    return `This action removes a #${id} warranty`;
  }
}
