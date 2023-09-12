import { IBaseRepositoy } from 'src/core/repositories/base/base-interface.repository';

import { CartItem } from '../entity/cart-item.entity';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { FindOneOptions } from 'typeorm';

export const CartItemRepositoryInterface = 'ICartItemRepository';
export interface ICartItemRepository extends IBaseRepositoy<CartItem> {

    update(id: string | number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem>;
    getCartItemWithProductsAndCart(id: string): Promise<CartItem>;
}