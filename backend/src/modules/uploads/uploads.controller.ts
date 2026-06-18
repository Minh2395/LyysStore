import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { UploadsService } from './uploads.service';
import { Public } from '../../decorator/customize';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  findAll() {
    return this.uploadsService.findAll();
  }

  @Post('file')
  @Public()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + extname(file.originalname);

          callback(null, uniqueName);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('FILE = ', file);

    if (!file) {
      return {
        message: 'No file uploaded',
      };
    }

    return {
      filename: file.filename,
      size: file.size,
      url: `/uploads/${file.filename}`,
    };
  }
}
