import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepositoryInterface } from './interfaces/product-repository.interface';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';
import { Product } from './entity/product.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UserModule, CategoryModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: `${ProductRepositoryInterface}`,
      useClass: ProductRepository,
    },
  ],
  exports: [
    ProductService,
    {
      provide: `${ProductRepositoryInterface}`,
      useClass: ProductRepository,
    },
  ]
})
export class ProductModule {}
