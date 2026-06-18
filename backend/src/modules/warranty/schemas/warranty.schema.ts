import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';
import { ProductVariant } from '../../product-variants/schemas/product-variant.schema';
import { User } from '../../users/schemas/user.schema';
import { Order } from '../../orders/schemas/order.schema';

export type WarrantyDocument = HydratedDocument<Warranty>;

export enum WarrantyStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true, collection: 'warranty' })
export class Warranty {
  @Prop({
    type: Types.ObjectId,
    ref: Order.name,
    required: true,
  })
  order_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: ProductVariant.name,
    required: true,
  })
  variant_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id: Types.ObjectId;

  @Prop({
    required: true,
    min: 0,
  })
  warranty_months: number;

  @Prop({
    required: true,
  })
  start_date: Date;

  @Prop({
    required: true,
  })
  end_date: Date;

  @Prop({
    type: String,
    enum: WarrantyStatus,
    default: WarrantyStatus.ACTIVE,
  })
  status: WarrantyStatus;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  created_by: Types.ObjectId;
}

export const WarrantySchema = SchemaFactory.createForClass(Warranty);
