import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Order } from '../../orders/schemas/order.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true, collection: 'invoices' })
export class Invoice {
  @Prop({ type: String })
  id: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  invoice_number: string;

  @Prop({
    type: Types.ObjectId,
    ref: Order.name,
    required: true,
    unique: true,
  })
  order_id: Types.ObjectId;

  @Prop({
    default: 0,
    min: 0,
  })
  tax: number;

  @Prop({
    required: true,
    min: 0,
  })
  subtotal: number;

  @Prop({
    required: true,
    min: 0,
  })
  total: number;

  @Prop({
    required: true,
  })
  issued_at: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
