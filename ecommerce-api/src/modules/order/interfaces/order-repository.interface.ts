import { IBaseRepositoy } from "../../../core/repositories/base/base-interface.repository";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { Order } from "../entity/order.entity";

export const OrderRepositoryInterface = 'IOrderRepository';
export interface IOrderRepository extends IBaseRepositoy<Order>{

    findOneByCartID(id: string): Promise<Order> 
    getOrderWithProducts(id: string): Promise<Order>;

}