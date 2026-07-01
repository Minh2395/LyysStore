import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Upload, UploadDocument } from './schemas/upload.schema';

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(Upload.name)
    private uploadModel: Model<UploadDocument>,
  ) {}

  async findAll() {
    return this.uploadModel.find();
  }
}
