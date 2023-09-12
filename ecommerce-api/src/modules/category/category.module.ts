import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repository/category.repository';
import { CategoryRepositoryInterface } from './interfaces/category-repository.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), UserModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: `${CategoryRepositoryInterface}`,
      useClass: CategoryRepository,
    },
  ],
  exports: [
    CategoryService,
    {
      provide: `${CategoryRepositoryInterface}`,
      useClass: CategoryRepository,
    },
  ],
})
export class CategoryModule {}
