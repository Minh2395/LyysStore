import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';
import { ProductVariant } from '../../product-variants/schemas/product-variant.schema';
import { Order } from '../../orders/schemas/order.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({ type: String })
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: ProductVariant.name,
  })
  variant_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Order.name,
  })
  order_id: Types.ObjectId;

  @Prop({
    required: true,
    min: 1,
    max: 5,
  })
  rating: number;

  @Prop({
    trim: true,
  })
  comment: string;

  @Prop({
    type: [String],
    default: [],
  })
  images: string[];

  @Prop({
    default: false,
  })
  is_verified_purchase: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
