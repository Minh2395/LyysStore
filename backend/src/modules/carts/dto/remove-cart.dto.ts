import { IsArray } from 'class-validator';

export class RemoveCartItemsDto {
  @IsArray()
  productIds: string[];
}
