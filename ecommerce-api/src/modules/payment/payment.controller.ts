import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  Request,
  Res,
  Response,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { IPayment } from './interfaces/payment.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentDto } from './dto/payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import RequestWithRawBody from 'src/core/interfaces/request-with-raw-body.interface';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  /**
   * Get all payments details
   * Retrieves all payments from the payment service.
   * @returns A Promise that resolves to the retrieve all the payments.
   */
  @Get()
  @ApiOkResponse({
    description: 'Retrieve all payments successfully',
    type: [PaymentDto],
  })
  @ApiBadRequestResponse({
    description: 'Payments cannot retrieve. Please try again',
  })
  async getAllPayments(): Promise<IPayment[]> {
    return this.paymentService.getAllPayments();
  }

  /**
   * Get single payment details
   * Retrieves a single payment with the given ID.
   * @param id The ID of the payment to retrieve.
   * @returns A Promise that resolves to the retrieve payment.
   */
  @Get(':id')
  @ApiOkResponse({
    description: 'Retrieve payment successfully',
    type: PaymentDto,
  })
  @ApiNotFoundResponse({
    description: 'Payment not found',
  })
  async getSinglePayment(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IPayment> {
    return this.paymentService.getSinglePayment(id);
  }

  /**
   * Create a payment session
   * Creates a new Payment with the given order ID & product details.
   * @param createPaymentDto The DTO containing the data for the new payment session.
   * @returns A Promise that resolves to the created payment session details.
   */
  @Post()
  @ApiCreatedResponse({
    description: 'Payment created successfully',
    type: CreatePaymentDto,
  })
  @ApiBadRequestResponse({
    description: 'Payment cannot create. Please try again',
  })
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<IPayment> {
    return this.paymentService.createPayment(createPaymentDto);
  }

  /**
   * Update a payment status
   * Updates an existing payment status with the given status.
   * @param id The ID of the payment to update.
   * @param updatePaymentDto The DTO containing the status data to update the payment status.
   * @returns A Promise that resolves to the updated payment.
   * May be a unnecessary endpoint***************************
   */
  // @Put(':id')
  // @ApiOkResponse({
  //   description: 'Payment status updated successfully',
  //   type: UpdatePaymentDto,
  // })
  // @ApiNotFoundResponse({
  //   description: 'Payment details not found',
  // })
  // async updateCategory(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updatePaymentDto: UpdatePaymentDto,
  // ): Promise<IPayment> {
  //   return this.paymentService.updatePaymentData(id, updatePaymentDto);
  // }

  /**
   * Refunds a payment
   * Refunds a payment with the given payment ID.
   * @param refundPaymentDto The DTO containing the data for the refunds payment.
   * @returns A Promise that resolves to the refund payment details.
   */
  @Post('refund')
  @ApiCreatedResponse({
    description: 'Payment refund successfully',
    type: RefundPaymentDto,
  })
  @ApiBadRequestResponse({
    description: 'Payment cannot refund. Please try again',
  })
  async refundPayment(
    @Body() refundPaymentDto: RefundPaymentDto,
  ): Promise<IPayment> {
    return this.paymentService.refundPayment(refundPaymentDto);
  }

  /**
   * Trigger the stripe webhook event
   * Trigger a stripe webhook events and doing to the necessary database updates.
   * @request Request containing the data for the stripe webhook event.
   * @returns This is a non return type method which is calling the database updating functionalities.
\   */
  @Post('webhook')
  async triggerWebhookEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    return this.paymentService.triggerWebhookEvents(signature, request.rawBody);
  }
}
