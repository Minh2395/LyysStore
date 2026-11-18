import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting, Upload } from '../../database/entities';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
  ) {}

  async findOne() {
    const setting = await this.settingRepository.findOne({ where: {} });
    if (!setting?.logo_upload_id) {
      return setting;
    }

    const upload = await this.uploadRepository.findOneBy({
      _id: setting.logo_upload_id,
    });
    return { ...setting, logo_upload_id: upload ?? setting.logo_upload_id };
  }
}
