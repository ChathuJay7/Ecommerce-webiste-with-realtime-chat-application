import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { EMailModule } from './modules/email/email.module';
import { ProductModule } from './modules/product/product.module';
import getConfig from './core/config/configurations';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    UserModule,
    TypeOrmModule.forRoot(getConfig().DATABASE),
    AuthModule,
    EMailModule,
    CategoryModule,
    ProductModule,
    PaymentModule,
    OrderModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
