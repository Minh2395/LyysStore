import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type StoreDocument = HydratedDocument<Store>;

@Schema({ timestamps: true, collection: 'stores' })
export class Store {
  @Prop({ type: String })
  id: string;

  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner_id: Types.ObjectId;

  @Prop()
  description: string;

  @Prop({
    default: 0,
    min: 0,
    max: 5,
  })
  rating: number;

  @Prop({
    default: true,
  })
  is_active: boolean;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
