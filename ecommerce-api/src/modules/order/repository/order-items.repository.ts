import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepositoryImpl } from "../../../core/repositories/base/base-abstract.repository";
import { IBaseRepositoy } from "../../../core/repositories/base/base-interface.repository";
import { IOrderItemsRepository } from "../interfaces/order-items-repository.interface";
import { OrderItems } from "../entity/order-item.entity";
import { Repository } from "typeorm";
import { IOrderItems } from "../interfaces/order-items.interface";

export class OrderItemsRepository extends BaseAbstractRepositoryImpl<OrderItems> implements IOrderItemsRepository{

    constructor (
        @InjectRepository(OrderItems)
        private readonly orderItemsRepository: Repository<OrderItems>
    ) {
        super(orderItemsRepository);
    }


  
    // findAllById(orderId: string): Promise<IOrderItems[]>  {
    //     console.log(orderId);
    //     return this.orderItemsRepository.findBy({ order: { id: orderId } });

    // }
    saveOrderItems(orderItems: any) {
        return this.orderItemsRepository.save(orderItems);
    }
}