import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductVariant } from '../../product-variants/schemas/product-variant.schema';
import { User } from '../../users/schemas/user.schema';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({ timestamps: true, collection: 'inventory' })
export class Inventory {
  @Prop({
    type: Types.ObjectId,
    ref: ProductVariant.name,
    required: true,
    unique: true,
  })
  variant_id: Types.ObjectId;

  @Prop({
    required: true,
    default: 0,
    min: 0,
  })
  quantity_on_hand: number;

  @Prop({
    required: true,
    default: 0,
    min: 0,
  })
  quantity_reserved: number;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  updated_by: Types.ObjectId;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
