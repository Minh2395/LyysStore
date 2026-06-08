import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { ProductVariant } from '../../product-variants/schemas/product-variant.schema';
import { Coupon } from '../../coupons/schemas/coupon.schema';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum ShippingStatus {
  PENDING = 'PENDING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

class OrderItem {
  @Prop({
    type: Types.ObjectId,
    ref: ProductVariant.name,
    required: true,
  })
  variant_id: Types.ObjectId;

  @Prop()
  product_name: string;

  @Prop()
  sku: string;

  @Prop({
    type: Object,
    default: {},
  })
  attributes: Record<string, any>;

  @Prop()
  quantity: number;

  @Prop()
  unit_price: number;

  @Prop()
  total_price: number;
}

class AddressSnapshot {
  @Prop()
  receiver_name: string;

  @Prop()
  phone: string;

  @Prop()
  province: string;

  @Prop()
  district: string;

  @Prop()
  ward: string;

  @Prop()
  street: string;

  @Prop()
  address_line: string;
}

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  @Prop({
    required: true,
    unique: true,
  })
  order_code: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Coupon.name,
  })
  coupon_id: Types.ObjectId;

  @Prop()
  coupon_code: string;

  @Prop({
    type: [OrderItem],
    default: [],
  })
  items: OrderItem[];

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  shipping_fee: number;

  @Prop({ default: 0 })
  total: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  payment_status: PaymentStatus;

  @Prop({
    type: String,
    enum: ShippingStatus,
    default: ShippingStatus.PENDING,
  })
  shipping_status: ShippingStatus;

  @Prop({
    type: AddressSnapshot,
    required: true,
  })
  address_snapshot: AddressSnapshot;
}
