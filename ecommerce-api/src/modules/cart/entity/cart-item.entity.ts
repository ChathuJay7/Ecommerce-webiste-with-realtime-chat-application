import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from 'src/modules/cart/entity/cart.entity';
import { ICartItem } from '../interfaces/cart-item.interface';
import { Product } from 'src/modules/product/entity/product.entity';



@Entity('cart-items')
export class CartItem implements ICartItem {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, {onDelete: 'CASCADE'})
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems, {onDelete: 'CASCADE'})
  product: Product;

//   @ManyToOne(() => Product, { onDelete: 'CASCADE' })
//   product: Product;

}