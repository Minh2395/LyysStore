import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';

export type ProductDetailDocument = HydratedDocument<ProductDetail>;

@Schema({ timestamps: true, collection: 'product_details' })
export class ProductDetail {
  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
    unique: true,
  })
  product_id: Types.ObjectId;

  @Prop()
  long_description: string;

  @Prop({
    type: Object,
    default: {},
  })
  specifications: Record<string, any>;

  @Prop()
  seo_title: string;

  @Prop()
  seo_description: string;
}

export const ProductDetailSchema = SchemaFactory.createForClass(ProductDetail);
