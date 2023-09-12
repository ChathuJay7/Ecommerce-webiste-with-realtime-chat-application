import { InjectRepository } from "@nestjs/typeorm";
import { BaseAbstractRepositoryImpl } from "../../../core/repositories/base/base-abstract.repository";
import { Order } from "../entity/order.entity";
import { IOrderRepository } from "../interfaces/order-repository.interface";
import { Category } from "../../category/entity/category.entity";
import { Repository } from "typeorm";
import { UpdateOrderDto } from "../dto/update-order.dto";

export class OrderRepository extends BaseAbstractRepositoryImpl<Order> implements IOrderRepository {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>
    ){
        super(orderRepository);
    }

    findOneByCartID(id: string): Promise<Order> {
        return this.orderRepository.findOneBy({ cart: { id: id } });
    }

    async getOrderWithProducts(id: string): Promise<Order> {
        return this.orderRepository.findOne({
            where: { id: id },
            relations: ['cart','cart.cartItems','cart.cartItems.product'],
          });
    }
}