import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  SHIPPING = 'SHIPPING',
  PROMOTION = 'PROMOTION',
  SYSTEM = 'SYSTEM',
}

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification {
  @Prop({ type: String })
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  message: string;

  @Prop({
    type: String,
    enum: NotificationType,
    required: true,
  })
  type: NotificationType;

  @Prop({
    default: false,
  })
  is_read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
