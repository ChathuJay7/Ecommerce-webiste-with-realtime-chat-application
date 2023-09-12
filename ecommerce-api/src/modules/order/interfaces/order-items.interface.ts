import { Order } from "../entity/order.entity";

export class IOrderItems{

    id: string;
    // productId: string;
    quantity: number;
    unitPrice: number;
    total: number;

    // Many to One Column 
    // order: Order;
}