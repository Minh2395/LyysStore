import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductVariant } from '../../product-variants/schemas/product-variant.schema';
import { User } from '../../users/schemas/user.schema';

export type StockInDocument = HydratedDocument<StockIn>;

@Schema({ timestamps: true, collection: 'stock_in' })
export class StockIn {
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
  cost_price: number;

  @Prop({
    required: true,
    trim: true,
  })
  reference_code: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  created_by: Types.ObjectId;

  @Prop()
  note: string;
}

export const StockInSchema = SchemaFactory.createForClass(StockIn);
