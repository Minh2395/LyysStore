import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';
import { User } from '../../users/schemas/user.schema';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;

@Schema({ timestamps: true, collection: 'product_variants' })
export class ProductVariant {
  @Prop({ type: String })
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product_id: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  sku: string;

  @Prop({
    type: Object,
    default: {},
  })
  attributes: Record<string, any>;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    required: true,
    min: 0,
  })
  cost_price: number;

  @Prop({
    default: false,
  })
  is_default: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  created_by: Types.ObjectId;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);
