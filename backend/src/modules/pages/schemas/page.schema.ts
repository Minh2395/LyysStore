import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PageDocument = HydratedDocument<Page>;

export enum PageType {
  PAGE = 'PAGE',
  POLICY = 'POLICY',
  FAQ = 'FAQ',
}

@Schema({ timestamps: true, collection: 'pages' })
export class Page {
  @Prop({ type: String })
  id: string;

  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  slug: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    type: String,
    enum: PageType,
    default: PageType.PAGE,
  })
  type: PageType;

  @Prop({
    default: false,
  })
  is_published: boolean;

  @Prop()
  seo_title: string;

  @Prop()
  seo_description: string;
}

export const PageSchema = SchemaFactory.createForClass(Page);
