import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IOrder } from "../interfaces/order.interface";
import { OrderItems } from "./order-item.entity";
import { Cart } from "../../cart/entity/cart.entity";

@Entity('orders')
export class Order implements IOrder{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    subTotal: number;

    @Column({ default: 'update'})
    status: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    orderDate: Date;

    @OneToOne(() => Cart, (cart) => cart.order)
    @JoinColumn()
    cart: Cart;

    // @OneToMany(() => OrderItems, (ordersItem) => ordersItem.order)
    // orderItems: OrderItems[];
}