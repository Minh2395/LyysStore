import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum AccountType {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ type: String })
  id: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ type: String, enum: AccountType, default: AccountType.LOCAL })
  account_type: AccountType;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ required: false })
  verification_code: string;

  @Prop({ type: Date, required: false })
  verification_expires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
