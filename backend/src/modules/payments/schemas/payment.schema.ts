import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Order } from '../../orders/schemas/order.schema';

export type PaymentDocument = HydratedDocument<Payment>;

export enum PaymentMethod {
  COD = 'COD',
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Schema({ timestamps: true, collection: 'payments' })
export class Payment {
  @Prop({ type: String })
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: Order.name,
    required: true,
  })
  order_id: Types.ObjectId;

  @Prop({
    type: String,
    enum: PaymentMethod,
    required: true,
  })
  method: PaymentMethod;

  @Prop({
    required: true,
    min: 0,
  })
  amount: number;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Prop()
  transaction_id: string;

  @Prop()
  paid_at: Date;

  @Prop({
    type: Object,
    default: {},
  })
  gateway_response: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
