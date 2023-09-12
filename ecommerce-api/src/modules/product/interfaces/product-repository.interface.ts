
import { UpdateProductDto } from "../dto/update-product.dto";
import { IBaseRepositoy } from "src/core/repositories/base/base-interface.repository";
import { Product } from "../entity/product.entity";
import { ProductFilterDto } from "../dto/filter-product.dto";


export const ProductRepositoryInterface = 'IProductRepository';

export interface IProductRepository extends IBaseRepositoy<Product> {
    findProductByName(name: string): Promise<Product>;
    update(id: string | number, updateProductDto: UpdateProductDto): Promise<Product> ;
}
