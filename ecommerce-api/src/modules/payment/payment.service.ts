import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { IPayment } from './interfaces/payment.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import {
  IPaymentRepository,
  PaymentRepositoryInterface,
} from './interfaces/payment-repository.interface';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import getConfig from '../../core/config/configurations';
import {
  IOrderRepository,
  OrderRepositoryInterface,
} from '../order/interfaces/order-repository.interface';
import { Payment } from './entity/payment.entity';
import { PaymentStatus } from '../../core/constants/payment-status';
import {
  IPaymentGateway,
  PaymentGatewayInterface,
} from '../stripe/interfaces/payment-gatway.interface';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(`${PaymentRepositoryInterface}`)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(`${OrderRepositoryInterface}`)
    private readonly orderRepository: IOrderRepository,
    @Inject(forwardRef(() => `${PaymentGatewayInterface}`))
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  /**
   * Get all payments
   * Retrieves all payments from the payment service.
   * @returns A Promise that resolves to the retrieve all the payments.
   */
  async getAllPayments(): Promise<IPayment[]> {
    return await this.paymentRepository.findAll();
  }

  /**
   * Get single payment session
   * Retrieves a single payment with the given ID.
   * @param id The ID of the payment to retrieve.
   * @returns A Promise that resolves to the retrieve payment.
   * @throws NotFoundException If no payment is found with the given ID.
   */
  async getSinglePayment(id: string): Promise<IPayment> {
    const payment = await this.paymentRepository.findOneById(id);
    if (!payment) {
      throw new NotFoundException({
        message: Messages.ERROR.PAYMENT_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }
    return payment;
  }

  /**
   * Get single payment details
   * Retrieves a single payment with the given checkoutSessionId.
   * @param checkoutSessionId The ID of the payment details to retrieve.
   * @returns A Promise that resolves to the retrieve payment.
   * @throws NotFoundException If no payment is found with the given checkoutSessionId.
   */
  async getPaymentByCheckoutSessionId(
    checkoutSessionId: string,
  ): Promise<IPayment> {
    const checkoutSession =
      await this.paymentRepository.findOneByCheckoutSessionId(
        checkoutSessionId,
      );
    if (!checkoutSession) {
      throw new NotFoundException({
        message: Messages.ERROR.PAYMENT_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }
    return checkoutSession;
  }

  /**
   * Create a payment session
   * Creates a new Payment with the given order ID & product details.
   * @param createPaymentDto The DTO containing the data for the new payment session.
   * @returns A Promise that resolves to the created payment session details.
   * @throws NotFoundException If no order is found with the given ID.
   */
  async createPayment(createPaymentDto: CreatePaymentDto): Promise<IPayment> {
    const { orderId } = createPaymentDto;

    const orderDetails = await this.orderRepository.getOrderWithProducts(
      orderId,
    );
    const orderItems = orderDetails.cart.cartItems;

    if (!orderDetails) {
      throw new NotFoundException({
        message: Messages.ERROR.ORDER_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }

    if (!orderItems) {
      throw new NotFoundException({
        message: Messages.ERROR.ORDER_ITEMS_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }

    try {
      const existingCheckoutSession =
        await this.paymentRepository.findOneByOrderId(orderId);

      if (
        existingCheckoutSession &&
        existingCheckoutSession.status === PaymentStatus.PROCESSING
      ) {
        return existingCheckoutSession;
      } else if (
        existingCheckoutSession &&
        (existingCheckoutSession.status === PaymentStatus.SUCCEEDED ||
          existingCheckoutSession.status === PaymentStatus.REFUNDED ||
          existingCheckoutSession.status === PaymentStatus.FAILED)
      ) {
        throw new BadRequestException({
          message: Messages.ERROR.PAYMENT_SESSION_EXPIRED,
          status_code: Status_Code.ERROR_CODE.BAD_REQUEST,
        });
      } else {
        const session = await this.paymentGateway.createCheckoutSession(
          orderId,
          orderItems,
        );

        const currentDate = new Date();
        const date = currentDate
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .replace(/\//g, '-');

        const payment = new Payment();
        payment.totalAmount = orderDetails.subTotal;
        payment.date = date;
        payment.orderId = orderId;
        payment.status = PaymentStatus.PROCESSING;
        payment.checkoutSessionId = session.id;
        payment.checkoutUrl = session.url;

        const createdPayment = await this.paymentRepository.create(payment);

        return createdPayment;
      }
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }

  /**
   * Update a payment status
   * Updates an existing payment status with the given status.
   * @param id The ID of the payment to update.
   * @param updatePaymentDto The DTO containing the status data to update the payment status.
   * @returns A Promise that resolves to the updated payment.
   * @throws NotFoundException If the specified payment is not found.
   */
  async updatePaymentData(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<IPayment> {
    const paymentDetails = await this.paymentRepository.findOneById(id);
    if (!paymentDetails) {
      throw new NotFoundException({
        message: Messages.ERROR.PAYMENT_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }
    const updatedPaymentDetails = await this.paymentRepository.update(
      id,
      updatePaymentDto,
    );
    return updatedPaymentDetails;
  }

  /**
   * Refunds a payment
   * Refunds a payment with the given payment ID.
   * @param refundPaymentDto The DTO containing the data for the refunds payment.
   * @returns A Promise that resolves to the refund payment details.
   * @throws NotFoundException If no payment is found with the given payment ID which payment status called "SUCCESS".
   */
  async refundPayment(refundPaymentDto: RefundPaymentDto): Promise<IPayment> {
    const paymentId = refundPaymentDto.paymentId;
    const payment = await this.paymentRepository.findOneById(paymentId);

    if (!payment) {
      throw new NotFoundException({
        message: Messages.ERROR.PAYMENT_NOT_FOUND,
        status_code: Status_Code.ERROR_CODE.NOT_FOUND,
      });
    }
    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new BadRequestException({
        message: Messages.ERROR.PAYMENT_CANNOT_REFUND,
        status_code: Status_Code.ERROR_CODE.BAD_REQUEST,
      });
    }
    try {
      return await this.paymentGateway.createRefundPayment(
        payment.paymentIntentId,
      );
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }

  /**
   * Trigger the stripe webhook event
   * Trigger a stripe webhook events and doing to the necessary database updates.
   * @request Request containing the data for the stripe webhook event.
   * @returns This is a non return type method which is calling the database updating functionalities.
   */
  async triggerWebhookEvents(signature: string, payload: Buffer): Promise<any> {
    try {
      return await this.paymentGateway.listenWebhookEvents(signature, payload);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Checkout Session Completed
   * Update the payment intent ID in the database when checkout session completed
   * @parameters paymentIntent The paymentIntent containing the webhook event data object.
   */
  async checkoutSessionCompleted(paymentIntent: any): Promise<any> {
    try {
      if (
        paymentIntent.status === 'complete' &&
        paymentIntent.payment_status === 'paid'
      ) {
        // Getting the payment data by using the checkoutSessionId
        const checkoutSessionId = paymentIntent.id;
        const paymentIntentId = paymentIntent.payment_intent;
        const payment = await this.getPaymentByCheckoutSessionId(
          checkoutSessionId,
        );
        const { id } = payment;

        // Saving the payment Intent Id in the database
        const updatePaymentDto: UpdatePaymentDto = {
          paymentIntentId: paymentIntentId,
        };
        await this.updatePaymentData(id, updatePaymentDto);
      }
      return paymentIntent;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }

  /**
   * Payment Intent Succeeded
   * Payment Intent Succeeded status updated in database
   * @parameters paymentIntent The paymentIntent containing the webhook event data object.
   */
  async paymentIntentSucceeded(paymentIntent: any): Promise<any> {
    try {
      if (
        paymentIntent.status === 'complete' &&
        paymentIntent.payment_status === 'paid'
      ) {
        // Getting the payment data by using the checkoutSessionId
        const checkoutSessionId = paymentIntent.id;
        const payment = await this.getPaymentByCheckoutSessionId(
          checkoutSessionId,
        );
        const { id } = payment;

        // Updating the payment status as 'SUCCEEDED' in the database
        const updatePaymentDto: UpdatePaymentDto = {
          status: PaymentStatus.SUCCEEDED,
        };
        await this.updatePaymentData(id, updatePaymentDto);
      }
      return paymentIntent;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }

  /**
   * Payment Intent Failed
   * Payment Intent Failed status updated in database
   * @parameters paymentIntent The paymentIntent containing the webhook event data object.
   */
  async paymentIntentFailed(paymentIntent: any): Promise<any> {
    try {
      if (
        paymentIntent.status === 'failed' &&
        paymentIntent.payment_status === 'unpaid'
      ) {
        // Getting the payment data by using the checkoutSessionId
        const checkoutSessionId = paymentIntent.id;
        const payment = await this.getPaymentByCheckoutSessionId(
          checkoutSessionId,
        );
        const { id } = payment;

        // Updating the payment status as 'FAILED' in the database
        const updatePaymentDto: UpdatePaymentDto = {
          status: PaymentStatus.FAILED,
        };
        await this.updatePaymentData(id, updatePaymentDto);
      }
      return paymentIntent;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }

  /**
   * Payment Intent Refunded
   * Payment Intent Refunded status updated in database
   * @parameters paymentIntent The paymentIntent containing the webhook event data object.
   */
  async paymentIntentRefunded(paymentIntent: any): Promise<any> {
    try {
      if (
        paymentIntent.status === 'succeeded' &&
        paymentIntent.refunded === true
      ) {
        // Getting the payment data by using the checkoutSessionId
        const checkoutSessionId = paymentIntent.id;
        const payment = await this.getPaymentByCheckoutSessionId(
          checkoutSessionId,
        );
        const { id } = payment;

        // Updating the payment status as 'REFUNDED' in the database
        const updatePaymentDto: UpdatePaymentDto = {
          status: PaymentStatus.REFUNDED,
        };
        await this.updatePaymentData(id, updatePaymentDto);
      }
      return paymentIntent;
    } catch (error) {
      console.log(error);
      return error.response;
    }
  }
}
