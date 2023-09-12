import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IProduct } from "../interfaces/product.interface";
import { Category } from "src/modules/category/entity/category.entity";
import { OrderItems } from "../../order/entity/order-item.entity";

import { CartItem } from "src/modules/cart/entity/cart-item.entity";

@Entity()
export class Product implements IProduct{

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    color: string

    @Column()
    price: number

    @Column('simple-array')
    image: string

    @Column()
    discount: number

    @Column()
    description: string

    @Column()
    quantity: number

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;
    
    @ManyToOne(() => OrderItems, (orderitem) => orderitem.products)
    orderItems: OrderItems[];

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    cartItems: CartItem[];
}