import { IBaseRepositoy } from 'src/core/repositories/base/base-interface.repository';
import { Cart } from '../entity/cart.entity';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { FindOneOptions } from 'typeorm';

export const CartRepositoryInterface = 'ICartRepository';
export interface ICartRepository extends IBaseRepositoy<Cart> {

    update(id: string | number, updateCategoryDto: UpdateCartDto): Promise<Cart>;
    getCartWithCartItems(id: string): Promise<Cart>;
}