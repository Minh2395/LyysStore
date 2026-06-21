import { Controller, Get } from '@nestjs/common';
import { Public } from '../../decorator/customize';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Public()
  @Get()
  async getNews() {
    return await this.newsService.getNews();
  }
}
