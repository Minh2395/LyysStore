import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type UploadDocument = HydratedDocument<Upload>;

export enum EntityType {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  USER = 'USER',
  BRAND = 'BRAND',
}

export enum UploadType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

@Schema({ timestamps: true, collection: 'uploads' })
export class Upload {
  @Prop({ type: String })
  id: string;

  @Prop({ required: true })
  url: string;

  @Prop({
    type: String,
    enum: UploadType,
    required: true,
  })
  type: UploadType;

  @Prop({ required: true, min: 0 })
  size: number;

  @Prop({
    type: String,
    enum: EntityType,
    required: true,
  })
  entity_type: EntityType;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  entity_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  uploaded_by: Types.ObjectId;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
