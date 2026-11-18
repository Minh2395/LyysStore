import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @Matches(/^[a-f\d]{24}$/i)
  parent_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  sort_order?: number;
}
