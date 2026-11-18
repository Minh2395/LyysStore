import { randomBytes } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

const booleanTransformer = {
  to: (value: boolean | null | undefined) =>
    value == null ? value : Number(value),
  from: (value: number | string | boolean | null) =>
    value == null ? value : value === true || value === 1 || value === '1',
};

export abstract class MysqlEntity {
  @PrimaryColumn({ type: 'char', length: 24 })
  _id: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @BeforeInsert()
  assignId() {
    if (!this._id) {
      this._id = randomBytes(12).toString('hex');
    }
  }
}

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

@Entity('users')
@Index('UQ_users_email', ['email'], { unique: true })
export class User extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 320 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 16, default: AccountType.LOCAL })
  account_type: AccountType = AccountType.LOCAL;

  @Column({ type: 'varchar', length: 16, default: UserRole.USER })
  role: UserRole = UserRole.USER;

  @Column({ type: 'boolean', default: true, transformer: booleanTransformer })
  is_active: boolean = true;

  @Column({ type: 'boolean', default: false, transformer: booleanTransformer })
  is_deleted: boolean = false;

  @Column({ type: 'datetime', nullable: true, default: null })
  deleted_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verification_code: string | null;

  @Column({ type: 'datetime', nullable: true })
  verification_expires: Date | null;
}

@Entity('categories')
@Index('UQ_categories_slug', ['slug'], { unique: true })
export class Category extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'char', length: 24, nullable: true })
  parent_id: string;

  @Column({ type: 'boolean', default: true, transformer: booleanTransformer })
  is_active: boolean = true;

  @Column({ type: 'double', default: 0 })
  sort_order: number = 0;

  @Column({ type: 'char', length: 24 })
  created_by: string;
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('products')
@Index('UQ_products_slug', ['slug'], { unique: true })
export class Product extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'char', length: 24 })
  category_id: string;

  @Column({ type: 'double' })
  base_price: number;

  @Column({ type: 'varchar', length: 16, default: ProductStatus.DRAFT })
  status: ProductStatus = ProductStatus.DRAFT;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'char', length: 24 })
  created_by: string;

  @Column({ type: 'char', length: 24, nullable: true })
  updated_by: string;
}

@Entity('product_variants')
@Index('UQ_product_variants_sku', ['sku'], { unique: true })
export class ProductVariant extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'char', length: 24 })
  product_id: string;

  @Column({ type: 'varchar', length: 255 })
  sku: string;

  @Column({ type: 'simple-json', nullable: true })
  attributes: Record<string, any> = {};

  @Column({ type: 'double' })
  price: number;

  @Column({ type: 'double' })
  cost_price: number;

  @Column({ type: 'double', default: 0 })
  stock: number = 0;

  @Column({ type: 'boolean', default: false, transformer: booleanTransformer })
  is_default: boolean = false;

  @Column({ type: 'char', length: 24 })
  created_by: string;
}

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  CHECKED_OUT = 'CHECKED_OUT',
  ABANDONED = 'ABANDONED',
}

export class CartItem {
  product_id: string;
  quantity: number;
  price: number;
}

@Entity('carts')
@Index('UQ_carts_user_id', ['user_id'], { unique: true })
export class Cart extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'char', length: 24 })
  user_id: string;

  @Column({ type: 'simple-json', nullable: true })
  items: CartItem[] = [];

  @Column({ type: 'double', default: 0 })
  total_price: number = 0;

  @Column({ type: 'double', default: 0 })
  total_quantity: number = 0;

  @Column({ type: 'varchar', length: 16, default: CartStatus.ACTIVE })
  status: CartStatus = CartStatus.ACTIVE;
}

@Entity('stores')
export class Store extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  email: string;

  @Column({ type: 'char', length: 24 })
  owner_id: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'double', default: 0 })
  rating: number = 0;

  @Column({ type: 'boolean', default: true, transformer: booleanTransformer })
  is_active: boolean = true;
}

export enum EntityType {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  USER = 'USER',
  BRAND = 'BRAND',
  SYSTEM = 'SYSTEM',
}

export enum UploadType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
}

@Entity('uploads')
export class Upload extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'varchar', length: 16 })
  type: UploadType;

  @Column({ type: 'double' })
  size: number;

  @Column({ type: 'varchar', length: 16 })
  entity_type: EntityType;

  @Column({ type: 'char', length: 24 })
  entity_id: string;

  @Column({ type: 'char', length: 24 })
  uploaded_by: string;
}

@Entity('settings')
export class Setting extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  site_name: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  hotline: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  email: string;

  @Column({ type: 'char', length: 24, nullable: true })
  logo_upload_id: string;
}

@Entity('addresses')
export class Address extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'char', length: 24 })
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  receiver_name: string;

  @Column({ type: 'varchar', length: 64 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  province: string;

  @Column({ type: 'varchar', length: 255 })
  district: string;

  @Column({ type: 'varchar', length: 255 })
  ward: string;

  @Column({ type: 'varchar', length: 255 })
  street: string;

  @Column({ type: 'varchar', length: 512 })
  address_line: string;

  @Column({ type: 'boolean', default: false, transformer: booleanTransformer })
  is_default: boolean;
}

@Entity('product_details')
@Index('UQ_product_details_product_id', ['product_id'], { unique: true })
export class ProductDetail extends MysqlEntity {
  @Column({ type: 'char', length: 24 })
  product_id: string;

  @Column({ type: 'text', nullable: true })
  long_description: string;

  @Column({ type: 'simple-json', nullable: true })
  specifications: Record<string, any> = {};

  @Column({ type: 'varchar', length: 255, nullable: true })
  seo_title: string;

  @Column({ type: 'text', nullable: true })
  seo_description: string;
}

@Entity('wishlists')
@Index(
  'UQ_wishlists_user_product_variant',
  ['user_id', 'product_id', 'variant_id'],
  {
    unique: true,
  },
)
export class Wishlist extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'char', length: 24 })
  user_id: string;

  @Column({ type: 'char', length: 24 })
  product_id: string;

  @Column({ type: 'char', length: 24, nullable: true })
  variant_id: string;
}

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

@Entity('coupons')
@Index('UQ_coupons_code', ['code'], { unique: true })
export class Coupon extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 16 })
  type: CouponType;

  @Column({ type: 'double' })
  value: number;

  @Column({ type: 'double', default: 0 })
  min_order_value: number = 0;

  @Column({ type: 'double', default: 0 })
  max_discount: number = 0;

  @Column({ type: 'double', default: 0 })
  usage_limit: number = 0;

  @Column({ type: 'double', default: 0 })
  used_count: number = 0;

  @Column({ type: 'datetime' })
  start_date: Date;

  @Column({ type: 'datetime' })
  end_date: Date;

  @Column({ type: 'boolean', default: true, transformer: booleanTransformer })
  is_active: boolean = true;
}

@Entity('inventory')
@Index('UQ_inventory_variant_id', ['variant_id'], { unique: true })
export class Inventory extends MysqlEntity {
  @Column({ type: 'char', length: 24 })
  variant_id: string;

  @Column({ type: 'double', default: 0 })
  quantity_on_hand: number = 0;

  @Column({ type: 'double', default: 0 })
  quantity_reserved: number = 0;

  @Column({ type: 'char', length: 24 })
  updated_by: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderPaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum OrderShippingStatus {
  PENDING = 'PENDING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export class OrderItem {
  variant_id: string;
  product_name: string;
  sku: string;
  attributes: Record<string, any>;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export class AddressSnapshot {
  receiver_name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  address_line: string;
}

@Entity('orders')
@Index('UQ_orders_order_code', ['order_code'], { unique: true })
export class Order extends MysqlEntity {
  @Column({ type: 'varchar', length: 255 })
  order_code: string;

  @Column({ type: 'char', length: 24 })
  user_id: string;

  @Column({ type: 'char', length: 24, nullable: true })
  coupon_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  coupon_code: string;

  @Column({ type: 'simple-json', nullable: true })
  items: OrderItem[] = [];

  @Column({ type: 'double', default: 0 })
  subtotal: number = 0;

  @Column({ type: 'double', default: 0 })
  discount: number = 0;

  @Column({ type: 'double', default: 0 })
  shipping_fee: number = 0;

  @Column({ type: 'double', default: 0 })
  total: number = 0;

  @Column({ type: 'varchar', length: 16, default: OrderStatus.PENDING })
  status: OrderStatus = OrderStatus.PENDING;

  @Column({
    type: 'varchar',
    length: 16,
    default: OrderPaymentStatus.UNPAID,
  })
  payment_status: OrderPaymentStatus = OrderPaymentStatus.UNPAID;

  @Column({
    type: 'varchar',
    length: 16,
    default: OrderShippingStatus.PENDING,
  })
  shipping_status: OrderShippingStatus = OrderShippingStatus.PENDING;

  @Column({ type: 'simple-json' })
  address_snapshot: AddressSnapshot;
}

@Entity('invoices')
@Index('UQ_invoices_invoice_number', ['invoice_number'], { unique: true })
@Index('UQ_invoices_order_id', ['order_id'], { unique: true })
export class Invoice extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  invoice_number: string;

  @Column({ type: 'char', length: 24 })
  order_id: string;

  @Column({ type: 'double', default: 0 })
  tax: number = 0;

  @Column({ type: 'double' })
  subtotal: number;

  @Column({ type: 'double' })
  total: number;

  @Column({ type: 'datetime' })
  issued_at: Date;
}

export enum NotificationType {
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  SHIPPING = 'SHIPPING',
  PROMOTION = 'PROMOTION',
  SYSTEM = 'SYSTEM',
}

@Entity('notifications')
export class Notification extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'char', length: 24 })
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 16 })
  type: NotificationType;

  @Column({ type: 'boolean', default: false, transformer: booleanTransformer })
  is_read: boolean = false;
}

export enum PageType {
  PAGE = 'PAGE',
  POLICY = 'POLICY',
  FAQ = 'FAQ',
}

@Entity('pages')
@Index('UQ_pages_slug', ['slug'], { unique: true })
export class Page extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ type: 'varchar', length: 16, default: PageType.PAGE })
  type: PageType = PageType.PAGE;

  @Column({ type: 'boolean', default: false, transformer: booleanTransformer })
  is_published: boolean = false;

  @Column({ type: 'varchar', length: 255, nullable: true })
  seo_title: string;

  @Column({ type: 'text', nullable: true })
  seo_description: string;
}

export enum PaymentMethod {
  COD = 'COD',
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Entity('payments')
export class Payment extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'char', length: 24 })
  order_id: string;

  @Column({ type: 'varchar', length: 32 })
  method: PaymentMethod;

  @Column({ type: 'double' })
  amount: number;

  @Column({ type: 'varchar', length: 16, default: PaymentStatus.PENDING })
  status: PaymentStatus = PaymentStatus.PENDING;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_id: string;

  @Column({ type: 'datetime', nullable: true })
  paid_at: Date;

  @Column({ type: 'simple-json', nullable: true })
  gateway_response: Record<string, any> = {};
}

@Entity('reviews')
export class Review extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'char', length: 24 })
  user_id: string;

  @Column({ type: 'char', length: 24 })
  product_id: string;

  @Column({ type: 'char', length: 24, nullable: true })
  variant_id: string;

  @Column({ type: 'char', length: 24, nullable: true })
  order_id: string;

  @Column({ type: 'double' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'simple-json', nullable: true })
  images: string[] = [];

  @Column({ type: 'boolean', default: false, transformer: booleanTransformer })
  is_verified_purchase: boolean = false;
}

export enum ShippingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

@Entity('shipping')
export class Shipping extends MysqlEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  id: string;

  @Column({ type: 'char', length: 24 })
  order_id: string;

  @Column({ type: 'varchar', length: 255 })
  carrier: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tracking_number: string;

  @Column({ type: 'double', default: 0 })
  shipping_fee: number = 0;

  @Column({ type: 'varchar', length: 16, default: ShippingStatus.PENDING })
  status: ShippingStatus = ShippingStatus.PENDING;

  @Column({ type: 'datetime', nullable: true })
  estimated_delivery: Date;

  @Column({ type: 'datetime', nullable: true })
  shipped_at: Date;

  @Column({ type: 'datetime', nullable: true })
  delivered_at: Date;
}

@Entity('stock_in')
export class StockIn extends MysqlEntity {
  @Column({ type: 'char', length: 24 })
  variant_id: string;

  @Column({ type: 'double' })
  quantity: number;

  @Column({ type: 'double' })
  cost_price: number;

  @Column({ type: 'varchar', length: 255 })
  reference_code: string;

  @Column({ type: 'char', length: 24 })
  created_by: string;

  @Column({ type: 'text', nullable: true })
  note: string;
}

export enum StockOutReason {
  ORDER = 'ORDER',
  DAMAGED = 'DAMAGED',
  LOST = 'LOST',
  RETURN_SUPPLIER = 'RETURN_SUPPLIER',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity('stock_out')
export class StockOut extends MysqlEntity {
  @Column({ type: 'char', length: 24 })
  variant_id: string;

  @Column({ type: 'double' })
  quantity: number;

  @Column({ type: 'varchar', length: 24 })
  reason: StockOutReason;

  @Column({ type: 'char', length: 24, nullable: true })
  reference_order_id: string;

  @Column({ type: 'char', length: 24 })
  created_by: string;
}

export enum WarrantyStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('warranty')
export class Warranty extends MysqlEntity {
  @Column({ type: 'char', length: 24 })
  order_id: string;

  @Column({ type: 'char', length: 24 })
  product_id: string;

  @Column({ type: 'char', length: 24 })
  variant_id: string;

  @Column({ type: 'char', length: 24 })
  user_id: string;

  @Column({ type: 'double' })
  warranty_months: number;

  @Column({ type: 'datetime' })
  start_date: Date;

  @Column({ type: 'datetime' })
  end_date: Date;

  @Column({ type: 'varchar', length: 16, default: WarrantyStatus.ACTIVE })
  status: WarrantyStatus = WarrantyStatus.ACTIVE;

  @Column({ type: 'char', length: 24 })
  created_by: string;
}

export const DATABASE_ENTITIES = [
  User,
  Category,
  Product,
  ProductVariant,
  Cart,
  Store,
  Upload,
  Setting,
  Address,
  ProductDetail,
  Wishlist,
  Coupon,
  Inventory,
  Order,
  Invoice,
  Notification,
  Page,
  Payment,
  Review,
  Shipping,
  StockIn,
  StockOut,
  Warranty,
];
