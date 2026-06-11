import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SettingDocument = HydratedDocument<Setting>;

@Schema({
  timestamps: true,
  collection: 'settings',
})
export class Setting {
  @Prop()
  site_name: string;

  @Prop()
  hotline: string;

  @Prop()
  email: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Upload',
  })
  logo_upload_id: Types.ObjectId;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
