import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop({ default: 'LOCAL' })
  account_type: string;

  @Prop({ default: 'USERS' })
  role: string;

  @Prop({ default: false })
  is_active: boolean;

  @Prop()
  verification_code: string;

  @Prop()
  verification_expires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
