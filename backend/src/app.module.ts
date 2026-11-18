import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_ENTITIES } from './database/entities';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ProductsModule } from './modules/products/products.module';
import { ProductVariantsModule } from './modules/product-variants/product-variants.module';
import { ProductDetailsModule } from './modules/product-details/product-details.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CartsModule } from './modules/carts/carts.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { StockInModule } from './modules/stock-in/stock-in.module';
import { StockOutModule } from './modules/stock-out/stock-out.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { WarrantyModule } from './modules/warranty/warranty.module';
import { StoresModule } from './modules/stores/stores.module';
import { PagesModule } from './modules/pages/pages.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AdminModule } from './modules/admin/admin.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { TransformInterceptor } from './core/transform.interceptor';
import { RolesGuard } from './auth/passport/roles.guard';
import { SettingsModule } from './modules/settings/settings.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>('MYSQL_HOST', 'localhost'),
        port: Number(configService.get<string>('MYSQL_PORT', '3306')),
        username: configService.get<string>('MYSQL_USER', 'lyys_store'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE', 'lyys_store'),
        entities: DATABASE_ENTITIES,
        synchronize:
          configService.get<string>('MYSQL_SYNCHRONIZE', 'true') === 'true',
      }),
      inject: [ConfigService],
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: { from: '"No Reply" <noreply@example.com>' },
        template: {
          dir: process.cwd() + '/src/mail/templates',
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    AddressesModule,
    AdminModule,
    SettingsModule,

    CategoriesModule,
    UploadsModule,
    ProductsModule,
    ProductVariantsModule,
    ProductDetailsModule,
    InventoryModule,
    StockInModule,
    StockOutModule,
    WarrantyModule,

    CartsModule,
    OrdersModule,
    PaymentsModule,
    InvoicesModule,
    CouponsModule,
    ShippingModule,

    ReviewsModule,
    WishlistModule,
    StoresModule,
    PagesModule,
    NotificationsModule,
    ReportsModule,
    NewsModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
