import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';
import { ProductVariant } from '../../product-variants/schemas/product-variant.schema';

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema({ timestamps: true, collection: 'wishlists' })
export class Wishlist {
  @Prop({ type: String })
  id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: ProductVariant.name,
  })
  variant_id: Types.ObjectId;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

WishlistSchema.index(
  {
    user_id: 1,
    product_id: 1,
    variant_id: 1,
  },
  {
    unique: true,
  },
);
