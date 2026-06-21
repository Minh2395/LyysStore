import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsService {
  private readonly apiKey = process.env.GNEWS_API_KEY;

  async getNews() {
    const keywords = [
      'eyewear trends',
      'designer sunglasses',
      'luxury eyewear',
      'fashion week eyewear',
      'gentle monster',
      'ray ban',
      'gucci sunglasses',
      'prada eyewear',
      'fashion models sunglasses',
      'street style glasses',
    ];

    const requests = keywords.map(async (keyword) => {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(
          keyword,
        )}&lang=en&max=10&apikey=${process.env.API_KEY_NEWS}`,
      );

      const data = await res.json();

      return data.articles || [];
    });

    const results = await Promise.all(requests);

    return results
      .flat()
      .sort(
        (a: any, b: any) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .slice(0, 30);
  }
}
