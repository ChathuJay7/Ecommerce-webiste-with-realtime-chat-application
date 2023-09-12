import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repository/order.repository';
import { OrderRepositoryInterface } from './interfaces/order-repository.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { UserModule } from '../user/user.module';
import { OrderItemsRepositoryInterface } from './interfaces/order-items-repository.interface';
import { OrderItemsRepository } from './repository/order-items.repository';
import { OrderItems } from './entity/order-item.entity';
import { ProductService } from '../product/product.service';
import { ProductRepositoryInterface } from '../product/interfaces/product-repository.interface';
import { ProductRepository } from '../product/repositories/product.repository';
import { Product } from '../product/entity/product.entity';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';
import { CartModule } from '../cart/cart.module';


@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItems]), UserModule, ProductModule, CategoryModule, CartModule],
  controllers: [OrderController],
  providers: [
    OrderService,
  {
    provide: `${OrderRepositoryInterface}`,
    useClass: OrderRepository,
  },
  {
    provide: `${OrderItemsRepositoryInterface}`,
    useClass: OrderItemsRepository,
  }
 
],
  exports: [
    OrderService, OrderRepositoryInterface, OrderItemsRepositoryInterface,
  {
    provide: `${OrderRepositoryInterface}`,
    useClass: OrderRepository,
  },
  {
    provide: `${OrderItemsRepositoryInterface}`,
    useClass: OrderItemsRepository,
  }

],
})
export class OrderModule {}
