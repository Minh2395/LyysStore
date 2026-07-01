import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductVariant } from '../../product-variants/schemas/product-variant.schema';
import { User } from '../../users/schemas/user.schema';
import { Order } from '../../orders/schemas/order.schema';

export type StockOutDocument = HydratedDocument<StockOut>;

export enum StockOutReason {
  ORDER = 'ORDER',
  DAMAGED = 'DAMAGED',
  LOST = 'LOST',
  RETURN_SUPPLIER = 'RETURN_SUPPLIER',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Schema({ timestamps: true, collection: 'stock_out' })
export class StockOut {
  @Prop({
    type: Types.ObjectId,
    ref: ProductVariant.name,
    required: true,
  })
  variant_id: Types.ObjectId;

  @Prop({
    required: true,
    min: 1,
  })
  quantity: number;

  @Prop({
    type: String,
    enum: StockOutReason,
    required: true,
  })
  reason: StockOutReason;

  @Prop({
    type: Types.ObjectId,
    ref: Order.name,
  })
  reference_order_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  created_by: Types.ObjectId;
}

export const StockOutSchema = SchemaFactory.createForClass(StockOut);
