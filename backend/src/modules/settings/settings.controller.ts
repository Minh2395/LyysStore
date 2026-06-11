import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

import { Public } from '../../decorator/customize';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Public()
  findOne() {
    return this.settingsService.findOne();
  }
}
