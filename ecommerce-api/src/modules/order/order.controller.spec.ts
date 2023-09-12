import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { IOrder } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

describe('OrderController', () => {
  let controller: OrderController;

  let mockOrderObj: IOrder = {
    id: "12a50bc0-83df-4bab-9ec5-d9f14aa6b393",
    subTotal: 0,
    status: 'pending',
    orderDate: new Date(),
    orderItems: []
  };

  let createOrderDto = new CreateOrderDto();
  createOrderDto.subTotal = 0;

  let updateOrderDto = new UpdateOrderDto();
  updateOrderDto.status = 'pending';

  let createOrderItemDto = new CreateOrderItemDto();
  createOrderItemDto.productId = "12a50bc0-83df-4bab-9ec5-d9f14aa6b393";
  createOrderItemDto.quantity = 2;

  const mockOrderService = {
    getAllOrders: jest.fn().mockReturnValue(mockOrderObj),
    getSingleOrder: jest.fn().mockReturnValue(mockOrderObj),
    createOrder: jest.fn().mockReturnValue(mockOrderObj),
    updateOrder: jest.fn().mockReturnValue(mockOrderObj),
    deleteOrder: jest.fn().mockReturnValue({ message: 'Order deleted successfully' }),
    createOrderItems: jest.fn().mockReturnValue([mockOrderObj]),
    getAllItemsByOrderId: jest.fn().mockReturnValue(mockOrderObj),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        }
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllOrders', () => {

    it('getAllOrders method should be defined', () => {
      expect(controller.getAllOrders).toBeDefined();
    });

    it('should call the getAllOrders method of the OrderController', async () => {
      const actualResponse = await controller.getAllOrders();
      expect(actualResponse).toEqual(mockOrderObj);
      expect(mockOrderService.getAllOrders).toHaveBeenCalledWith();
    }
    );

  });

  describe('getSingleOrder', () => {

    it('getSingleOrder method should be defined', () => {
      expect(controller.getSingleOrder).toBeDefined();
    });

    it('should call the getSingleOrder method of the OrderController with order ID', async () => {
      const id = expect.any(String);
      const actualResponse = await controller.getSingleOrder(id);
      expect(actualResponse).toEqual(mockOrderObj);
      expect(mockOrderService.getSingleOrder).toHaveBeenCalledWith(id);
    });

  });

  describe('createOrderItems', () => {

    it('createOrderItems method should be defined', () => {
      expect(controller.createOrderItems).toBeDefined();
    });

    it('should call the createOrderItems method of the OrderController', async () => {
      const actualResponse = await controller.createOrderItems([createOrderItemDto]);
      expect(actualResponse).toEqual([mockOrderObj]);
      expect(mockOrderService.createOrderItems).toHaveBeenCalledWith([createOrderItemDto]);
    });
  });

  describe('getOrderItemsByOrderId',() => {
    it('getAllItemsByOrderId method should be defined', () => {
      expect(controller.getOrderItemsByOrderId).toBeDefined();
    });

    it('should call the getAllItemsByOrderId method of the OrderController with order ID', async () => {
      const id = expect.any(String);
      const actualResponse = await controller.getOrderItemsByOrderId(id);
      expect(actualResponse).toEqual(mockOrderObj);
      expect(mockOrderService.getSingleOrder).toHaveBeenCalledWith(id);
    });
  });

  describe('updateOrder', () => {

    it('updateOrder method should be defined', () => {
      expect(controller.updateOrder).toBeDefined();
    });

    it('should call the updateOrder method of the OrderController with order ID', async () => {
      const id = expect.any(String);
      const actualResponse = await controller.updateOrder(id, updateOrderDto);
      expect(actualResponse).toEqual(mockOrderObj);
      expect(mockOrderService.updateOrder).toHaveBeenCalledWith(id, updateOrderDto);
    });
  });

  describe('deleteOrder', () => {

    it('deleteOrder method should be defined', () => {
      expect(controller.deleteOrder).toBeDefined();
    });

    it('should call the deleteOrder method of the OrderController with order ID', async () => {
      const id = expect.any(String);
      const actualResponse = await controller.deleteOrder(id);
      expect(actualResponse).toEqual({ message: 'Order deleted successfully' });
      expect(mockOrderService.deleteOrder).toHaveBeenCalledWith(id);
    });
  }
  );


  
});
