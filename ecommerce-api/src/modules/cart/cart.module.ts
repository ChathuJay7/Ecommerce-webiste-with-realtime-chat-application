import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { CartController } from './cart.controller';
import { CartRepositoryInterface } from './interfaces/cart-repository.interface';
import { CartRepository } from './repository/cart.repository';
import { CartItem } from './entity/cart-item.entity';
import { CartItemRepositoryInterface } from './interfaces/cart-item-repository.interface';
import { CartItemRepository } from './repository/cart-item.repository';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), ProductModule, UserModule, JwtModule],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: `${CartRepositoryInterface}`,
      useClass: CartRepository,
    },
    {
      provide: `${CartItemRepositoryInterface}`,
      useClass: CartItemRepository,
    },
  ],
  exports: [
    CartService,
    {
      provide: `${CartRepositoryInterface}`,
      useClass: CartRepository,
    },
    {
      provide: `${CartItemRepositoryInterface}`,
      useClass: CartItemRepository,
    },
  ]
})
export class CartModule {}
