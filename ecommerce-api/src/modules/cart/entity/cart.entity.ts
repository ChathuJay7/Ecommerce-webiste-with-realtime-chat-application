import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ICart } from '../interfaces/cart.interface';
import { CartItem } from './cart-item.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Order } from '../../order/entity/order.entity';


@Entity('carts')
export class Cart implements ICart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: 0 })
  totalAmount: number

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];
    
  @OneToOne(() => User, (user) => user.cart, {onDelete: 'CASCADE'})
  @JoinColumn()
  user: User;

  @OneToOne(() => Order, (order) => order.cart)
    order: Order;

//   @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { eager: true })
//   cartItems: CartItem[];
}
