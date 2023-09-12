import { BaseAbstractRepositoryImpl } from '../../../core/repositories/base/base-abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CartItem } from '../entity/cart-item.entity';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { ICartItemRepository } from '../interfaces/cart-item-repository.interface';

export class CartItemRepository extends BaseAbstractRepositoryImpl<CartItem> implements ICartItemRepository {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {
    super(cartItemRepository);
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
    const cartItem = await this.findOneById(id);
    if (!cartItem) {
      return null;
    }
    Object.assign(cartItem, updateCartItemDto);
    return await this.cartItemRepository.save(cartItem);
  }


  async getCartItemWithProductsAndCart(id: string): Promise<CartItem> {
    const cartItem =  await this.cartItemRepository.findOne({
      where: { id: id },
      relations: ['product','cart'],
  });
    return cartItem;
  }


}
