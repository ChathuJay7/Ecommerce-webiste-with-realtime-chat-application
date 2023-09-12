import { IBaseRepositoy } from "../../../core/repositories/base/base-interface.repository";
import { OrderItems } from "../entity/order-item.entity";
import { IOrderItems } from "./order-items.interface";

export const OrderItemsRepositoryInterface = 'IOrderItemsRepository';

export interface IOrderItemsRepository extends IBaseRepositoy<OrderItems>{
    // findAllById(orderId: any): Promise<IOrderItems[]> ;
    saveOrderItems(orderItems: OrderItems): Promise<OrderItems>;
}