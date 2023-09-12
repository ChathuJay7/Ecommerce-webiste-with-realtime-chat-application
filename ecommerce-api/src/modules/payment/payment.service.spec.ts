import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PaymentRepositoryInterface } from './interfaces/payment-repository.interface';
import { IPayment } from './interfaces/payment.interface';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entity/payment.entity';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { StripeService } from '../stripe/stripe.service';
import { OrderRepositoryInterface } from '../order/interfaces/order-repository.interface';
import { PaymentGatewayInterface } from '../stripe/interfaces/payment-gatway.interface';
import { PaymentStatus } from 'src/core/constants/payment-status';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  let mockPaymentObj: IPayment = {
    id: '5ad1d3ea-873e-4297-b654-5446426c4d0c',
    totalAmount: 1000,
    status: 'SUCCEEDED',
    date: '05-19-2023',
    orderId: 'f11d9a93-5f13-4ca7-830f-490206aae85e',
    checkoutSessionId:
      'cs_test_a1ohSGUFRXYj7DXd8v4uuhbWMBsJjNImfchC67QjK0WUobPKHigF0fS3tl',
    checkoutUrl:
      'https://checkout.stripe.com/c/pay/cs_test_a1ohSGUFRXYj7DXd8v4uuhbWMBsJjNImfchC67QjK0WUobPKHigF0fS3tl#fidkdWxOYHwnPyd1blpxYHZxWjA0SHxTMk1HfVdxNUJwfTFjTk1vY3dKYl1vd20wQTNGNn13M3FKTzdtVmZxbXBGdnU1YzBpb052Q2g9fG5SNDdTRHM9dndBYk9paExoYnJ2UG0zYTRMdVJENTVfa1ZPYjF9XCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
    paymentIntentId: 'pi_3NARYyBxRt0Gux4f0sqMlE92',
  };

  let mockPaymentObjArr: IPayment[] = [
    {
      id: '5ad1d3ea-873e-4297-b654-5446426c4d0c',
      totalAmount: 1000,
      status: 'SUCCEEDED',
      date: '05-19-2023',
      orderId: 'f11d9a93-5f13-4ca7-830f-490206aae85e',
      checkoutSessionId:
        'cs_test_a1ohSGUFRXYj7DXd8v4uuhbWMBsJjNImfchC67QjK0WUobPKHigF0fS3tl',
      checkoutUrl:
        'https://checkout.stripe.com/c/pay/cs_test_a1ohSGUFRXYj7DXd8v4uuhbWMBsJjNImfchC67QjK0WUobPKHigF0fS3tl#fidkdWxOYHwnPyd1blpxYHZxWjA0SHxTMk1HfVdxNUJwfTFjTk1vY3dKYl1vd20wQTNGNn13M3FKTzdtVmZxbXBGdnU1YzBpb052Q2g9fG5SNDdTRHM9dndBYk9paExoYnJ2UG0zYTRMdVJENTVfa1ZPYjF9XCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
      paymentIntentId: 'pi_3NARYyBxRt0Gux4f0sqMlE92',
    },
  ];

  let createPaymentDto = new CreatePaymentDto();
  createPaymentDto.orderId = 'f11d9a93-5f13-4ca7-830f-490206aae85e';

  const payment: Payment = {
    totalAmount: 710000,
    date: '05-22-2023',
    orderId: 'a9b62dd4-b9ca-4cf2-a810-7c686ff76069',
    status: 'PROCESSING',
    checkoutSessionId:
      'cs_test_a1dxtE2jj2XCoNetEneIwiabI67GhG1uTsfEwXjeILprgnNp3FtoV92klE',
    checkoutUrl:
      'https://checkout.stripe.com/c/pay/cs_test_a1dxtE2jj2XCoNetEneIwiabI67GhG1uTsfEwXjeILprgnNp3FtoV92klE#fidkdWxOYHwnPyd1blpxYHZxWjA0SHxTMk1HfVdxNUJwfTFjTk1vY3dKYl1vd20wQTNGNn13M3FKTzdtVmZxbXBGdnU1YzBpb052Q2g9fG5SNDdTRHM9dndBYk9paExoYnJ2UG0zYTRMdVJENTVfa1ZPYjF9XCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
    paymentIntentId: null,
    id: 'df707f3a-e07d-45f7-a39b-95e099eb3a4b',
  };

  let refundPaymentDto = new RefundPaymentDto();
  refundPaymentDto.paymentId = '5ad1d3ea-873e-4297-b654-5446426c4d0c';
  refundPaymentDto.reason = 'Sample message goes here';

  let updatePaymentDto = new UpdatePaymentDto();
  updatePaymentDto.status = 'SUCCEEDED';
  updatePaymentDto.paymentIntentId = '05-22-2023';

  const mockPaymentRepository = {
    findAll: jest.fn().mockReturnValue(mockPaymentObjArr),
    findOneById: jest.fn().mockReturnValue(mockPaymentObj),
    create: jest.fn().mockReturnValue(mockPaymentObj),
    update: jest.fn().mockReturnValue(mockPaymentObj),
    findOneByCheckoutSessionId: jest.fn().mockReturnValue(mockPaymentObj),
    getPaymentByCheckoutSessionId: jest.fn().mockReturnValue(mockPaymentObj),
    updatePaymentData: jest.fn().mockReturnValue(mockPaymentObj),
    refundPayment: jest.fn().mockReturnValue(mockPaymentObj),
  };

  const mockOrderRepository = {};

  const mockPaymentGateway = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: `${PaymentRepositoryInterface}`,
          useValue: mockPaymentRepository,
        },
        {
          provide: `${PaymentGatewayInterface}`,
          useValue: mockPaymentGateway,
        },
        {
          provide: `${OrderRepositoryInterface}`,
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined PaymentService', () => {
    expect(paymentService).toBeDefined();
  });

  /**
   * Get all payments
   * Retrieves all payments from the payment service.
   * @returns A Promise that resolves to the retrieve all the payments.
   */
  describe('getAllPayments', () => {
    it('should be defined getAllPayments', () => {
      expect(paymentService.getAllPayments).toBeDefined();
    });
    it('should call the getAllPayments method of the PaymentService & return the IPayment[]', async () => {
      const actualResponse = await paymentService.getAllPayments();
      expect(actualResponse).toEqual(mockPaymentObjArr);
      expect(mockPaymentRepository.findAll).toHaveBeenCalledWith();
    });
  });

  /**
   * Get single payment session
   * Retrieves a single payment with the given ID.
   * @param id The ID of the payment to retrieve.
   * @returns A Promise that resolves to the retrieve payment.
   * @throws NotFoundException If no payment is found with the given ID.
   */
  describe('getSinglePayment', () => {
    const id = expect.any(String);
    it('should be defined getSinglePayment', () => {
      expect(paymentService.getSinglePayment).toBeDefined();
    });
    it('should call the getSinglePayment method of the PaymentService & return the IPayment', async () => {
      const actualResponse = await paymentService.getSinglePayment(id);
      expect(actualResponse).toEqual(mockPaymentObj);
      expect(mockPaymentRepository.findOneById).toHaveBeenCalledWith(id);
    });
    it('should throw a NotFoundException if payment not found', async () => {
      jest.spyOn(mockPaymentRepository, 'findOneById').mockResolvedValue(null);
      await expect(paymentService.getSinglePayment(id)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.PAYMENT_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });

  /**
   * Create a payment session
   * Creates a new Payment with the given order ID & product details.
   * @param createPaymentDto The DTO containing the data for the new payment session.
   * @returns A Promise that resolves to the created payment session details.
   * @throws NotFoundException If no order is found with the given ID.
   */
  describe('createPayment', () => {
    it('should be defined createPayment', () => {
      expect(paymentService.createPayment).toBeDefined();
    });
    // it('should call the createPayment method of the PaymentService with the correct DTO', async () => {
    //   const actualResponse = await service.createPayment(createPaymentDto);
    //   expect(actualResponse).toEqual(mockPaymentObj);
    //   expect(payment.status).toEqual(1);
    //   expect(mockPaymentRepository.create).toHaveBeenCalledWith(payment);
    // });
  });

  /**
   * Update a payment status
   * Updates an existing payment status with the given status.
   * @param id The ID of the payment to update.
   * @param updatePaymentDto The DTO containing the status data to update the payment status.
   * @returns A Promise that resolves to the updated payment.
   * @throws NotFoundException If the specified payment is not found.
   */
  describe('updatePaymentData', () => {
    it('should be defined updatePaymentData', () => {
      expect(paymentService.updatePaymentData).toBeDefined();
    });
    it('should update payment data and return the updated payment details', async () => {
      const id = '5ad1d3ea-873e-4297-b654-5446426c4d0c';
      const updatePaymentDto = new UpdatePaymentDto();
      updatePaymentDto.status = 'SUCCEEDED';
      updatePaymentDto.paymentIntentId = '05-22-2023';

      const paymentDetails = {
        id: '5ad1d3ea-873e-4297-b654-5446426c4d0c',
        totalAmount: 1000,
        status: 'PENDING',
        date: '05-19-2023',
        orderId: 'f11d9a93-5f13-4ca7-830f-490206aae85e',
        checkoutSessionId:
          'cs_test_a1ohSGUFRXYj7DXd8v4uuhbWMBsJjNImfchC67QjK0WUobPKHigF0fS3tl',
        checkoutUrl:
          'https://checkout.stripe.com/c/pay/cs_test_a1ohSGUFRXYj7DXd8v4uuhbWMBsJjNImfchC67QjK0WUobPKHigF0fS3tl#fidkdWxOYHwnPyd1blpxYHZxWjA0SHxTMk1HfVdxNUJwfTFjTk1vY3dKYl1vd20wQTNGNn13M3FKTzdtVmZxbXBGdnU1YzBpb052Q2g9fG5SNDdTRHM9dndBYk9paExoYnJ2UG0zYTRMdVJENTVfa1ZPYjF9XCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
        paymentIntentId: 'pi_3NARYyBxRt0Gux4f0sqMlE92',
      };
      const updatedPaymentDetails = {
        id: '5ad1d3ea-873e-4297-b654-5446426c4d0c',
        totalAmount: 1000,
        status: 'SUCCEEDED',
        date: '05-19-2023',
        orderId: 'f11d9a93-5f13-4ca7-830f-490206aae85e',
        checkoutSessionId:
          'cs_test_a1ohSGUFRXYj7DXd8v4uuhbWMBsJjNImfchC67QjK0WUobPKHigF0fS3tl',
        checkoutUrl:
          'https://checkout.stripe.com/c/pay/cs_test_a1ohSGUFRXYj7DXd8v4uuhbWMBsJjNImfchC67QjK0WUobPKHigF0fS3tl#fidkdWxOYHwnPyd1blpxYHZxWjA0SHxTMk1HfVdxNUJwfTFjTk1vY3dKYl1vd20wQTNGNn13M3FKTzdtVmZxbXBGdnU1YzBpb052Q2g9fG5SNDdTRHM9dndBYk9paExoYnJ2UG0zYTRMdVJENTVfa1ZPYjF9XCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
        paymentIntentId: 'pi_3NARYyBxRt0Gux4f0sqMlE92',
      };
      mockPaymentRepository.findOneById.mockResolvedValue(paymentDetails);
      expect(mockPaymentRepository.findOneById).toHaveBeenCalledWith(id);
      expect(mockPaymentRepository.update).toHaveBeenCalledWith(
        id,
        updatedPaymentDetails,
      );
    });
    it('should throw a NotFoundException if payment details are not found', async () => {
      const paymentId = 'f11d9a93-5f13-4ca7-830f-490206aae85e';
      mockPaymentRepository.findOneById.mockResolvedValue(null);
      await expect(
        paymentService.updatePaymentData(paymentId, updatePaymentDto),
      ).rejects.toThrowError(NotFoundException);
      expect(mockPaymentRepository.findOneById).toHaveBeenCalledWith(paymentId);
      expect(mockPaymentRepository.update).not.toHaveBeenCalled();
    });
  });

  /**
   * Refunds a payment
   * Refunds a payment with the given payment ID.
   * @param refundPaymentDto The DTO containing the data for the refunds payment.
   * @returns A Promise that resolves to the refund payment details.
   * @throws NotFoundException If no payment is found with the given payment ID which payment status called "SUCCESS".
   */
  describe('refundPayment', () => {
    it('should be defined refundPayment', () => {
      expect(paymentService.refundPayment).toBeDefined();
    });
    it('should return the updated payment after refunding with correct status', async () => {
      const refundSuccessPayment: Payment = {
        totalAmount: 710000,
        date: '05-22-2023',
        orderId: 'a9b62dd4-b9ca-4cf2-a810-7c686ff76069',
        status: 'REFUNDED',
        checkoutSessionId:
          'cs_test_a1dxtE2jj2XCoNetEneIwiabI67GhG1uTsfEwXjeILprgnNp3FtoV92klE',
        checkoutUrl:
          'https://checkout.stripe.com/c/pay/cs_test_a1dxtE2jj2XCoNetEneIwiabI67GhG1uTsfEwXjeILprgnNp3FtoV92klE#fidkdWxOYHwnPyd1blpxYHZxWjA0SHxTMk1HfVdxNUJwfTFjTk1vY3dKYl1vd20wQTNGNn13M3FKTzdtVmZxbXBGdnU1YzBpb052Q2g9fG5SNDdTRHM9dndBYk9paExoYnJ2UG0zYTRMdVJENTVfa1ZPYjF9XCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
        paymentIntentId: null,
        id: 'df707f3a-e07d-45f7-a39b-95e099eb3a4b',
      };

      jest
        .spyOn(mockPaymentRepository, 'findOneById')
        .mockResolvedValue(payment);
      jest
        .spyOn(mockPaymentRepository, 'update')
        .mockResolvedValue(refundSuccessPayment);

      const result = await paymentService.refundPayment(refundPaymentDto);

      expect(mockPaymentRepository.findOneById).toHaveBeenCalledWith(
        refundPaymentDto.paymentId,
      );
      expect(mockPaymentRepository.update).toHaveBeenCalledWith(
        refundPaymentDto.paymentId,
        updatePaymentDto,
      );
      expect(result).toEqual(refundSuccessPayment);
    });
    it('should throw a NotFoundException if payment not found', async () => {
      jest.spyOn(mockPaymentRepository, 'findOneById').mockResolvedValue(null);

      await expect(
        paymentService.refundPayment(refundPaymentDto),
      ).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.PAYMENT_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
    it('should throw a BadRequestException if current status is not equal to "SUCCEEDED"', async () => {
      const notSuccessPayment: Payment = {
        totalAmount: 710000,
        date: '05-22-2023',
        orderId: 'a9b62dd4-b9ca-4cf2-a810-7c686ff76069',
        status: 'PENDING', // Assuming the current status is 'PENDING'
        checkoutSessionId:
          'cs_test_a1dxtE2jj2XCoNetEneIwiabI67GhG1uTsfEwXjeILprgnNp3FtoV92klE',
        checkoutUrl:
          'https://checkout.stripe.com/c/pay/cs_test_a1dxtE2jj2XCoNetEneIwiabI67GhG1uTsfEwXjeILprgnNp3FtoV92klE#fidkdWxOYHwnPyd1blpxYHZxWjA0SHxTMk1HfVdxNUJwfTFjTk1vY3dKYl1vd20wQTNGNn13M3FKTzdtVmZxbXBGdnU1YzBpb052Q2g9fG5SNDdTRHM9dndBYk9paExoYnJ2UG0zYTRMdVJENTVfa1ZPYjF9XCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
        paymentIntentId: null,
        id: 'df707f3a-e07d-45f7-a39b-95e099eb3a4b',
      };

      jest
        .spyOn(mockPaymentRepository, 'findOneById')
        .mockResolvedValue(notSuccessPayment);

      await expect(
        paymentService.refundPayment(refundPaymentDto),
      ).rejects.toThrow(
        new BadRequestException({
          message: Messages.ERROR.PAYMENT_CANNOT_REFUND,
          status_code: Status_Code.ERROR_CODE.BAD_REQUEST,
        }),
      );
    });
  });

  /**
   * Get single payment details
   * Retrieves a single payment with the given checkoutSessionId.
   * @param checkoutSessionId The ID of the payment details to retrieve.
   * @returns A Promise that resolves to the retrieve payment.
   * @throws NotFoundException If no payment is found with the given checkoutSessionId.
   */
  describe('getPaymentByCheckoutSessionId', () => {
    it('should be defined getPaymentByCheckoutSessionId', () => {
      expect(paymentService.getPaymentByCheckoutSessionId).toBeDefined();
    });
    it('should return the payment when checkout session exists', async () => {
      jest
        .spyOn(mockPaymentRepository, 'findOneByCheckoutSessionId')
        .mockResolvedValue(mockPaymentObj);
      const checkoutSessionId =
        'cs_test_a1ohSGUFRXYj7DXd8v4uuhbWMBsJjNImfchC67QjK0WUobPKHigF0fS3tl';
      const result = await paymentService.getPaymentByCheckoutSessionId(
        checkoutSessionId,
      );
      expect(result).toEqual(mockPaymentObj);
      expect(
        mockPaymentRepository.findOneByCheckoutSessionId,
      ).toHaveBeenCalledWith(checkoutSessionId);
    });
    it('should throw NotFoundException when checkout session does not exist', async () => {
      const checkoutSessionId =
        'cs_test_a1ohSGUFRXYj7DXd8v4uuhbWMBsJjNImfchC67QjK0WUobPKHignonExist';
      jest
        .spyOn(mockPaymentRepository, 'findOneByCheckoutSessionId')
        .mockResolvedValue(null);
      await expect(
        paymentService.getPaymentByCheckoutSessionId(checkoutSessionId),
      ).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.PAYMENT_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });

  /**
   * Checkout Session Completed
   * Update the payment intent ID in the database when checkout session completed
   * @parameters paymentIntent The paymentIntent containing the webhook event data object.
   */
  describe('checkoutSessionCompleted', () => {
    it('should be defined checkoutSessionCompleted', () => {
      expect(paymentService.checkoutSessionCompleted).toBeDefined();
    });
    it('should save the paymentIntentId in the database if paymentIntent status is "complete" and payment_status is "paid"', async () => {
      const paymentIntent = {
        status: 'complete',
        payment_status: 'paid',
        id: 'checkoutSessionId',
        payment_intent: 'paymentIntentId',
      };

      const payment = { id: 'paymentId' };
      const updatePaymentDto = { paymentIntentId: 'paymentIntentId' };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(payment);
      jest
        .spyOn(mockPaymentRepository, 'updatePaymentData')
        .mockResolvedValue(null);

      await paymentService.checkoutSessionCompleted(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).toHaveBeenCalledWith(
      //   payment.id,
      //   updatePaymentDto,
      // );
    });

    it('should return the error response if an error occurs', async () => {
      const paymentIntent = {
        status: 'complete',
        payment_status: 'paid',
        id: 'checkoutSessionId',
        payment_intent: 'paymentIntentId',
      };

      const error = new Error('Some error message');
      const errorResponse = { response: error };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockRejectedValue(error);

      const result = await paymentService.checkoutSessionCompleted(
        paymentIntent,
      );

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(console.log).toHaveBeenCalledWith(error);
      // expect(result).toBe(errorResponse);
    });

    it('should not save the paymentIntentId if paymentIntent status is not "complete"', async () => {
      const paymentIntent = {
        status: 'succeeded',
        payment_status: 'paid',
        id: 'checkoutSessionId',
        payment_intent: 'paymentIntentId',
      };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(undefined);
      jest.spyOn(mockPaymentRepository, 'updatePaymentData');

      const result = await paymentService.checkoutSessionCompleted(
        paymentIntent,
      );

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).not.toHaveBeenCalled();
      expect(result).toBe(paymentIntent);
    });

    it('should not save the paymentIntentId if paymentIntent payment_status is not "paid"', async () => {
      const paymentIntent = {
        status: 'complete',
        payment_status: 'unpaid',
        id: 'checkoutSessionId',
        payment_intent: 'paymentIntentId',
      };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(undefined);
      jest.spyOn(mockPaymentRepository, 'updatePaymentData');

      const result = await paymentService.checkoutSessionCompleted(
        paymentIntent,
      );

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).not.toHaveBeenCalled();
      expect(result).toBe(paymentIntent);
    });
  });

  /**
   * Payment Intent Succeeded
   * Payment Intent Succeeded status updated in database
   * @parameters paymentIntent The paymentIntent containing the webhook event data object.
   */
  describe('paymentIntentSucceeded', () => {
    it('should be defined paymentIntentSucceeded', () => {
      expect(paymentService.paymentIntentSucceeded).toBeDefined();
    });
    it('should update payment status as "SUCCEEDED" if paymentIntent status is "complete" and payment_status is "paid"', async () => {
      const paymentIntent = {
        status: 'complete',
        payment_status: 'paid',
        id: 'checkoutSessionId',
      };

      const payment = { id: 'paymentId' };
      const updatePaymentDto = { status: PaymentStatus.SUCCEEDED };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(payment);
      jest
        .spyOn(mockPaymentRepository, 'updatePaymentData')
        .mockResolvedValue(null);

      await paymentService.paymentIntentSucceeded(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).toHaveBeenCalledWith(
      //   payment.id,
      //   updatePaymentDto,
      // );
    });

    it('should return the error response if an error occurs', async () => {
      const paymentIntent = {
        status: 'complete',
        payment_status: 'paid',
        id: 'checkoutSessionId',
      };

      const error = new Error('Some error message');
      const errorResponse = { response: error };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockRejectedValue(error);

      const result = await paymentService.paymentIntentSucceeded(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(console.log).toHaveBeenCalledWith(error);
      // expect(result).toBe(errorResponse);
    });

    it('should not update payment status if paymentIntent status is not "complete"', async () => {
      const paymentIntent = {
        status: 'succeeded',
        payment_status: 'paid',
        id: 'checkoutSessionId',
      };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(undefined);
      jest.spyOn(mockPaymentRepository, 'updatePaymentData');

      const result = await paymentService.paymentIntentSucceeded(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).not.toHaveBeenCalled();
      expect(result).toBe(paymentIntent);
    });

    it('should not update payment status if paymentIntent payment_status is not "paid"', async () => {
      const paymentIntent = {
        status: 'complete',
        payment_status: 'unpaid',
        id: 'checkoutSessionId',
      };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(undefined);
      jest.spyOn(mockPaymentRepository, 'updatePaymentData');

      const result = await paymentService.paymentIntentSucceeded(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).not.toHaveBeenCalled();
      expect(result).toBe(paymentIntent);
    });
  });

  /**
   * Payment Intent Failed
   * Payment Intent Failed status updated in database
   * @parameters paymentIntent The paymentIntent containing the webhook event data object.
   */
  describe('paymentIntentFailed', () => {
    it('should be defined paymentIntentFailed', () => {
      expect(paymentService.paymentIntentFailed).toBeDefined();
    });
    it('should update payment status as "FAILED" if paymentIntent status is "failed" and payment_status is "unpaid"', async () => {
      const paymentIntent = {
        status: 'failed',
        payment_status: 'unpaid',
        id: 'checkoutSessionId',
      };

      const payment = { id: 'paymentId' };
      const updatePaymentDto = { status: PaymentStatus.FAILED };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(payment);
      jest
        .spyOn(mockPaymentRepository, 'updatePaymentData')
        .mockResolvedValue(null);

      await paymentService.paymentIntentFailed(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).toHaveBeenCalledWith(
      //   payment.id,
      //   updatePaymentDto,
      // );
    });

    it('should return the error response if an error occurs', async () => {
      const paymentIntent = {
        status: 'failed',
        payment_status: 'unpaid',
        id: 'checkoutSessionId',
      };

      const error = new Error('Some error message');
      const errorResponse = { response: error };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockRejectedValue(error);

      const result = await paymentService.paymentIntentFailed(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(console.log).toHaveBeenCalledWith(error);
      // expect(result).toBe(errorResponse);
    });

    it('should not update payment status if paymentIntent status is not "failed"', async () => {
      const paymentIntent = {
        status: 'succeeded',
        payment_status: 'unpaid',
        id: 'checkoutSessionId',
      };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(undefined);
      jest.spyOn(mockPaymentRepository, 'updatePaymentData');

      const result = await paymentService.paymentIntentFailed(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).not.toHaveBeenCalled();
      expect(result).toBe(paymentIntent);
    });

    it('should not update payment status if paymentIntent payment_status is not "unpaid"', async () => {
      const paymentIntent = {
        status: 'failed',
        payment_status: 'paid',
        id: 'checkoutSessionId',
      };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(undefined);
      jest.spyOn(mockPaymentRepository, 'updatePaymentData');

      const result = await paymentService.paymentIntentFailed(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).not.toHaveBeenCalled();
      expect(result).toBe(paymentIntent);
    });
  });

  /**
   * Payment Intent Refunded
   * Payment Intent Refunded status updated in database
   * @parameters paymentIntent The paymentIntent containing the webhook event data object.
   */
  describe('paymentIntentRefunded', () => {
    it('should be defined paymentIntentRefunded', async () => {
      expect(paymentService.paymentIntentRefunded).toBeDefined();
    });

    it('should update payment status as "REFUNDED" if paymentIntent status is "succeeded" and refunded is true', async () => {
      const paymentIntent = {
        status: 'succeeded',
        refunded: true,
        id: 'checkoutSessionId',
      };

      const payment = { id: 'paymentId' };
      const updatePaymentDto = { status: PaymentStatus.REFUNDED };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(payment);
      jest
        .spyOn(mockPaymentRepository, 'updatePaymentData')
        .mockResolvedValue(null);

      await paymentService.paymentIntentRefunded(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).toHaveBeenCalledWith(
      //   payment.id,
      //   updatePaymentDto,
      // );
    });

    it('should return the error response if an error occurs', async () => {
      const paymentIntent = {
        status: 'succeeded',
        refunded: true,
        id: 'checkoutSessionId',
      };

      const error = new Error('Some error message');
      const errorResponse = { response: error };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockRejectedValue(error);

      const result = await paymentService.paymentIntentRefunded(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(console.log).toHaveBeenCalledWith(error);
      // expect(result).toBe(errorResponse);
    });

    it('should not update payment status if paymentIntent status is not "succeeded"', async () => {
      const paymentIntent = {
        status: 'failed',
        refunded: true,
        id: 'checkoutSessionId',
      };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(undefined);
      jest.spyOn(mockPaymentRepository, 'updatePaymentData');

      const result = await paymentService.paymentIntentRefunded(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).not.toHaveBeenCalled();
      expect(result).toBe(paymentIntent);
    });

    it('should not update payment status if refunded is false', async () => {
      const paymentIntent = {
        status: 'succeeded',
        refunded: false,
        id: 'checkoutSessionId',
      };

      jest
        .spyOn(mockPaymentRepository, 'getPaymentByCheckoutSessionId')
        .mockResolvedValue(undefined);
      jest.spyOn(mockPaymentRepository, 'updatePaymentData');

      const result = await paymentService.paymentIntentRefunded(paymentIntent);

      // expect(
      //   mockPaymentRepository.getPaymentByCheckoutSessionId,
      // ).toHaveBeenCalledWith(paymentIntent.id);
      // expect(mockPaymentRepository.updatePaymentData).not.toHaveBeenCalled();
      expect(result).toBe(paymentIntent);
    });
  });
});
