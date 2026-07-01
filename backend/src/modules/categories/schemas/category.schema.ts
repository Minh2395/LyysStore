import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  @Prop({ type: String })
  id: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, unique: true })
  slug: string;

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    required: false,
    default: null,
  })
  parent_id: Types.ObjectId;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: 0 })
  sort_order: number;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  created_by: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
