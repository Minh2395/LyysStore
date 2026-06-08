import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

@Schema({ timestamps: true, collection: 'coupons' })
export class Coupon {
  @Prop({ type: String })
  id: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  })
  code: string;

  @Prop({
    type: String,
    enum: CouponType,
    required: true,
  })
  type: CouponType;

  @Prop({
    required: true,
    min: 0,
  })
  value: number;

  @Prop({
    default: 0,
    min: 0,
  })
  min_order_value: number;

  @Prop({
    default: 0,
    min: 0,
  })
  max_discount: number;

  @Prop({
    default: 0,
    min: 0,
  })
  usage_limit: number;

  @Prop({
    default: 0,
    min: 0,
  })
  used_count: number;

  @Prop({
    required: true,
  })
  start_date: Date;

  @Prop({
    required: true,
  })
  end_date: Date;

  @Prop({
    default: true,
  })
  is_active: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
