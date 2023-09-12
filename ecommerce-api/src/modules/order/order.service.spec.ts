import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepositoryInterface } from './interfaces/order-repository.interface';
import { IOrder } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductService } from '../product/product.service';
import { ProductRepositoryInterface } from '../product/interfaces/product-repository.interface';
import { OrderItemsRepository } from './repository/order-items.repository';
import { OrderItemsRepositoryInterface } from './interfaces/order-items-repository.interface';
import { Messages } from '../../core/constants/messages';
import { Status_Code } from '../../core/constants/status-codes';
import { NotFoundException } from '@nestjs/common';
import { IOrderItems } from './interfaces/order-items.interface';

describe('OrderService', () => {
  let service: OrderService;

  let mockOrderObj: IOrder = {
    id: "12a50bc0-83df-4bab-9ec5-d9f14aa6b393",
    subTotal: 0,
    status: 'pending',
    orderDate: new Date(),
    orderItems: []
  };

  let mockOrderItemObj: IOrderItems = {
    quantity: 5,
    unitPrice: 50,
    total: 0,
    order: mockOrderObj,
    id: "12a50bc0-83df-4bab-9ec5-d9f14aa6b393",
  }

  let createOrderDto: CreateOrderDto = new CreateOrderDto();
  createOrderDto.subTotal = 0;


  let updateOrderDto: UpdateOrderDto = new UpdateOrderDto();
  updateOrderDto.status = 'cancelled';

  const mockOrderRepository = {
    find: jest.fn().mockReturnValue(mockOrderObj),
    findAll: jest.fn().mockReturnValue(mockOrderObj),
    findOneById: jest.fn().mockReturnValue(mockOrderObj),
    create: jest.fn().mockReturnValue(mockOrderObj),
    updates: jest.fn().mockReturnValue(mockOrderObj),
    delete: jest.fn().mockReturnValue({ message: 'Order deleted successfully' }),
  };

  const mockProductRepository = {
    find: jest.fn().mockReturnValue(mockOrderObj),
  };

  const mockOrderItemsRepository = {
    findAllById: jest.fn().mockReturnValue(mockOrderObj),
    saveOrderItems: jest.fn().mockReturnValue(mockOrderObj),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService, {
        provide: `${OrderRepositoryInterface}`,
        useValue: mockOrderRepository,
      },
      ProductService, {
        provide: `${ProductRepositoryInterface}`,
        useValue: mockProductRepository,
      },
     {
        provide: `${OrderItemsRepositoryInterface}`,
        useValue: mockOrderItemsRepository,
      }
    ], 

    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('getAllOrders', () => {
  //   it('should be defined', () => {
  //     expect(service.getAllOrders).toBeDefined();
  //   });

  //   it('should call the getAllOrders method of the OrderService', async () => {
  //     const actualResponse = await service.getAllOrders();
  //     expect(actualResponse).toEqual(mockOrderObj);
  //     expect(mockOrderRepository.findAll).toHaveBeenCalledWith();
  //   });
  // });

  describe('getSingleOrder', () => {
    it('should be defined', () => {
      expect(service.getSingleOrder).toBeDefined();
    });

    it('should call the getSingleOrder method of the OrderService', async () => {
      const actualResponse = await service.getSingleOrder('12a50bc0-83df-4bab-9ec5-d9f14aa6b393');
      expect(actualResponse).toEqual(mockOrderObj);
      expect(mockOrderRepository.findOneById).toHaveBeenCalledWith('12a50bc0-83df-4bab-9ec5-d9f14aa6b393');
    });
  });

  describe('createOrder', () => {
    it('should be defined',() => {
      expect(service.createOrder_bk).toBeDefined();
    });

    it('should call the createOrder method of the OrderService and Return the Created Order', async () => {
      const actualResponse = await service.createOrder_bk(createOrderDto);
      expect(actualResponse).toEqual(mockOrderObj);
      expect(mockOrderRepository.create).toHaveBeenLastCalledWith(createOrderDto);
    });
  });

  describe('updateOrder', () => {
    const id = '12a50bc0-83df-4bab-9ec5-d9f14aa6b393';
    it('should be defined',() => {
      expect(service.updateOrder).toBeDefined();
    });

    it('should throw NotFoundException if the order with given OrderId not exist', async () => {
      jest.spyOn(mockOrderRepository,'findOneById').mockReturnValue(undefined);
      await expect(service.updateOrder(id, updateOrderDto)).rejects.toThrowError(new NotFoundException({message: Messages.ERROR.ORDER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.ORDER_NOT_FOUND}));
        expect(mockOrderRepository.findOneById).toHaveBeenCalledWith(id);
    });

    it('should update the order with given orderID and return the Updated Order', async () => {
      jest.spyOn(mockOrderRepository,'findOneById').mockReturnValue(mockOrderObj);
      jest.spyOn(mockOrderRepository,'updates').mockReturnValue(mockOrderObj);

      const actualResponse = await service.updateOrder(id, updateOrderDto);

      expect(actualResponse).toEqual(mockOrderObj);
      expect(mockOrderRepository.findOneById).toHaveBeenCalledWith(id);
      expect(mockOrderRepository.updates).toHaveBeenCalledWith(mockOrderObj)
      expect(mockOrderObj.status).toEqual(updateOrderDto.status)

    })

  });
  
  describe('getSubTotal',() => {
    

    it('should be defined',() => {
      expect(service.getSubTotal).toBeDefined();
    });

    it('should retrive the orderItem related to the orderId', async () => {
      const id = '12a50bc0-83df-4bab-9ec5-d9f14aa6b393';
      jest.spyOn(mockOrderItemsRepository, 'findAllById').mockResolvedValue(mockOrderItemObj)

      const actualResult = await service.getSubTotal(id);

      expect(actualResult).toEqual(mockOrderItemObj.total);

    });

  });

  describe('deleteOrder', () => {
    const id = '12a50bc0-83df-4bab-9ec5-d9f14aa6b393';
    it('should be defined',() => {
      expect(service.deleteOrder).toBeDefined();
    });

    it('should call the deleteOrder method of the OrderService and return the Succesfully Deleted Message',async () => {
      jest.spyOn(mockOrderRepository, 'findOneById').mockResolvedValue(id);
      const actualResponse = await service.deleteOrder(id);
      expect(actualResponse).toEqual({ message: 'Order deleted successfully' });
      expect(mockOrderRepository.delete).toHaveBeenLastCalledWith(id);
      expect(mockOrderRepository.findOneById).toHaveBeenCalledWith(id);
    });

    it('should throw an error if the Order does not exist', async () => {
      jest.spyOn(mockOrderRepository, 'findOneById').mockResolvedValue(null);
      await expect(service.deleteOrder(id)).rejects.toThrowError('Order not found');
    });
  });


});
