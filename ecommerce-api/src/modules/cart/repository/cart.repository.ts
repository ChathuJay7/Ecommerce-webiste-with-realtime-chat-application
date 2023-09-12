import { BaseAbstractRepositoryImpl } from '../../../core/repositories/base/base-abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Cart } from '../entity/cart.entity';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { ICartRepository } from '../interfaces/cart-repository.interface';

export class CartRepository extends BaseAbstractRepositoryImpl<Cart> implements ICartRepository {

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {
    super(cartRepository);
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOneById(id);
    if (!cart) {
      return null;
    }
    Object.assign(cart, updateCartDto);
    return await this.cartRepository.save(cart);
  }

  async getCartWithCartItems(id: string): Promise<Cart> {
    const cart =  await this.cartRepository.findOne({
      where: { id: id },
      relations: ['cartItems','cartItems.product'],
    });
    return cart;
  }
  

}
