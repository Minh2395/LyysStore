import { IsNumber, Matches, Min } from 'class-validator';

export class AddCartDto {
  @Matches(/^[a-f\d]{24}$/i)
  product_id: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
