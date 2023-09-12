import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IOrderItems } from "../interfaces/order-items.interface";
import { Order } from "./order.entity";
import { Product } from "../../product/entity/product.entity";

@Entity()
export class OrderItems implements IOrderItems{

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    quantity: number;

    @Column()
    unitPrice: number;

    @Column({default: 0})
    total: number;

    // @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
    // order: Order;

    @ManyToOne(() => Product, (product) => product.orderItems)
    products: Product;


    

}
