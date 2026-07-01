import { Injectable } from '@nestjs/common';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { UpdateStockInDto } from './dto/update-stock-in.dto';

@Injectable()
export class StockInService {
  create(createStockInDto: CreateStockInDto) {
    return 'This action adds a new stockIn';
  }

  findAll() {
    return `This action returns all stockIn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockIn`;
  }

  update(id: number, updateStockInDto: UpdateStockInDto) {
    return `This action updates a #${id} stockIn`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockIn`;
  }
}
