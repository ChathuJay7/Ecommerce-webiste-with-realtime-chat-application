import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { IProductRepository } from "../interfaces/product-repository.interface";
import { BaseAbstractRepositoryImpl } from "src/core/repositories/base/base-abstract.repository";
import { UpdateProductDto } from "../dto/update-product.dto";
import { Product } from "../entity/product.entity";
import { ProductFilterDto } from "../dto/filter-product.dto";

export class ProductRepository extends BaseAbstractRepositoryImpl<Product> implements IProductRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {
        super(productRepository)
    }


    async findProductByName(name: string): Promise<Product> {
        return await this.productRepository.findOneBy({name});
    }

    async update(id: string | number, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.findOneById(id);
        if (!product) {
            return null;
        }
        Object.assign(product, updateProductDto);
        return await this.productRepository.save(product);
    }

}