import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Order } from '../../orders/schemas/order.schema';

export type ShippingDocument = HydratedDocument<Shipping>;

export enum ShippingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true, collection: 'shipping' })
export class Shipping {
  @Prop({ type: String })
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: Order.name,
    required: true,
  })
  order_id: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  carrier: string;

  @Prop({
    trim: true,
  })
  tracking_number: string;

  @Prop({
    default: 0,
    min: 0,
  })
  shipping_fee: number;

  @Prop({
    type: String,
    enum: ShippingStatus,
    default: ShippingStatus.PENDING,
  })
  status: ShippingStatus;

  @Prop()
  estimated_delivery: Date;

  @Prop()
  shipped_at: Date;

  @Prop()
  delivered_at: Date;
}

export const ShippingSchema = SchemaFactory.createForClass(Shipping);
