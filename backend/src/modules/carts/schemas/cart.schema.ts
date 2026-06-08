import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { ProductVariant } from '../../product-variants/schemas/product-variant.schema';

export type CartDocument = HydratedDocument<Cart>;

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  CHECKED_OUT = 'CHECKED_OUT',
  ABANDONED = 'ABANDONED',
}

class CartItem {
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
    required: true,
    min: 0,
  })
  price: number;
}

@Schema({ timestamps: true, collection: 'carts' })
export class Cart {
  @Prop({ type: String })
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  user_id: Types.ObjectId;

  @Prop({
    type: [CartItem],
    default: [],
  })
  items: CartItem[];

  @Prop({
    default: 0,
    min: 0,
  })
  total_price: number;

  @Prop({
    default: 0,
    min: 0,
  })
  total_quantity: number;

  @Prop({
    type: String,
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
