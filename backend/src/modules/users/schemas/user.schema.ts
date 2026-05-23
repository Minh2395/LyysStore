import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum AccountType {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  phone!: string;

  @Prop({ enum: AccountType, default: AccountType.USER })
  account_type!: AccountType;

  @Prop({ enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @Prop({ default: true })
  is_active!: boolean;

  @Prop()
  verification_code!: string;

  @Prop()
  verification_expires!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);