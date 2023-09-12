import { OrderItems } from "../entity/order-item.entity";

export interface IOrder {
    id: string;
    subTotal: number;
    status: string;
    orderDate: Date;
    // orderItems: OrderItems[];
}