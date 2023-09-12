import { Test, TestingModule } from "@nestjs/testing";
import { OrderRepository } from "./order.repository";
import { UpdateOrderDto } from "../dto/update-order.dto";
import { IOrder } from "../interfaces/order.interface";

describe('OrderRepository', () => {

    let repository: OrderRepository;

    let mockEntitytoUpdate : IOrder = {
        id: "12a50bc0-83df-4bab-9ec5-d9f14aa6b393",
        subTotal: 'duck',
        status: 'pending',
        orderDate: new Date(),
      };

    let updateOrderDto = new UpdateOrderDto ();
    updateOrderDto.orderItems = 'duck';
    updateOrderDto.status = 'pending';

    const mockOrderRepository = {
        update: jest.fn().mockReturnValue(mockEntitytoUpdate),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: OrderRepository,
                useValue: mockOrderRepository,
            }],
        }
        ).compile();

        repository = module.get<OrderRepository>(OrderRepository);
    });

    it('should be defined ProductRepository', () => {
        expect(repository).toBeDefined();
    });

    describe('update', () => {
            
            it('should be defined update', () => {
                expect(repository.update).toBeDefined();
            });

            it('should call the update method of the OrderRepository', async () => {

                const result = await repository.update(mockEntitytoUpdate);
                expect(result).toEqual(mockEntitytoUpdate);
                expect(mockOrderRepository.update).toHaveBeenCalledWith(mockEntitytoUpdate);
            });
            
    });

});