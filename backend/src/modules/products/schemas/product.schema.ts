import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { User } from '../../users/schemas/user.schema';

export type ProductDocument = HydratedDocument<Product>;

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ type: String })
  id: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category_id: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  base_price: number;

  @Prop({
    type: String,
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;

  @Prop()
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  created_by: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  updated_by: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
