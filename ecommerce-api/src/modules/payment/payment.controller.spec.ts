import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { IPayment } from './interfaces/payment.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

describe('PaymentController', () => {
  let controller: PaymentController;

  let mockPaymentObj: IPayment = {
    id: 'string',
    totalAmount: 1,
    status: 0,
    date: '04-19-2023',
  };

  let mockPaymentObjArr: IPayment[] = [
    {
      id: 'string',
      totalAmount: 1,
      status: 2,
      date: '04-19-2023',
    },
  ];

  let createPaymentDto = new CreatePaymentDto();
  createPaymentDto.totalAmount = 1000;

  let refundPaymentDto = new RefundPaymentDto();
  refundPaymentDto.paymentId = '12a50bc0-83df-4bab-9ec5-d9f14aa6b393';
  refundPaymentDto.amount = 1000;
  refundPaymentDto.reason = 'Sample message goes here';

  const mockPaymentService = {
    getAllPayments: jest.fn().mockReturnValue(mockPaymentObjArr),
    getSinglePayment: jest.fn().mockReturnValue(mockPaymentObj),
    createPayment: jest.fn().mockReturnValue(mockPaymentObj),
    refundPayment: jest.fn().mockReturnValue(mockPaymentObj),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined PaymentController', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllPayments', () => {
    it('should be defined getAllPayments', () => {
      expect(controller.getAllPayments).toBeDefined();
    });
    it('should call the getAllPayments method of the PaymentController & return the IPayment[]', async () => {
      const actualResponse = await controller.getAllPayments();
      expect(actualResponse).toEqual(mockPaymentObjArr);
      expect(mockPaymentService.getAllPayments).toHaveBeenCalledWith();
    });
  });

  describe('getSinglePayment', () => {
    it('should be defined getSinglePayment', () => {
      expect(controller.getSinglePayment).toBeDefined();
    });
    it('should call the getSinglePayment method of the PaymentController with payment ID', async () => {
      const id = expect.any(String);
      const actualResponse = await controller.getSinglePayment(id);
      expect(actualResponse).toEqual(mockPaymentObj);
      expect(mockPaymentService.getSinglePayment).toHaveBeenCalledWith(id);
    });
  });

  describe('createPayment', () => {
    it('should be defined createPayment', () => {
      expect(controller.createPayment).toBeDefined();
    });
    it('should call the createPayment method of the PaymentController with the correct DTO', async () => {
      const actualResponse = await controller.createPayment(createPaymentDto);
      expect(actualResponse).toEqual(mockPaymentObj);
      expect(mockPaymentService.createPayment).toHaveBeenCalledWith(
        createPaymentDto,
      );
    });
  });

  describe('refundPayment', () => {
    it('should be defined refundPayment', () => {
      expect(controller.refundPayment).toBeDefined();
    });
    it('should call the refundPayment method of the PaymentController with the correct DTO', async () => {
      const actualResponse = await controller.refundPayment(refundPaymentDto);
      expect(actualResponse).toEqual(mockPaymentObj);
      expect(mockPaymentService.refundPayment).toHaveBeenCalledWith(
        refundPaymentDto,
      );
    });
  });
});
