import { ApiProperty } from '@nestjs/swagger';
import { IPayment } from '../interfaces/payment.interface';
import { IsNumber, IsString } from 'class-validator';

export class PaymentDto implements IPayment {
  /**
   * The ID of the payment.
   */
  @ApiProperty({
    description: 'This is the payment id',
    example: '12a50bc0-83df-4bab-9ec5-d9f14aa6b393',
  })
  @IsString()
  id: string;

  /**
   * The total amount of the payment.
   */
  @ApiProperty({
    description: 'This is the payment total amount',
    example: '1000',
  })
  @IsNumber()
  totalAmount: number;

  /**
   * The status of the payment.
   */
  @ApiProperty({
    description: 'This is the payment status',
    example: 'SUCCESS',
  })
  @IsNumber()
  status: string;

  /**
   * The date of the payment.
   */
  @ApiProperty({
    description: 'This is the payment date',
    example: '2023/04/18',
  })
  @IsString()
  date: string;

  /**
   * The order ID of the payment.
   */
  @ApiProperty({
    description: 'This is the payment order ID',
    example: 'f11d9a93-5f13-4ca7-830f-490206aae85e',
  })
  @IsString()
  orderId: string;

  /**
   * The payment checkout session ID of the payment session.
   */
  @ApiProperty({
    description: 'This is the payment checkout session ID',
    example: 'cs_test_a17kxzH75WmYwDFmq4N8vUK3UTWlntvQ9SlAQNBecMQwBID6ldYEwoOuz3',
  })
  @IsString()
  checkoutSessionId: string;

  /**
   * The checkout session URL of the payment.
   */
  @ApiProperty({
    description: 'This is the payment checkout session URL',
    example: 'https://checkout.stripe.com/c/pay/cs_test_a17kxzH75WmYwDFmq4N8vUK3UTWlntvQ9SlAQNBecMQwBID6ldYEwoOuz3#fidkdWxOYHwnPyd1blpxYHZxWjA0SHxTMk1HfVdxNUJwfTFjTk1vY3dKYl1vd20wQTNGNn13M3FKTzdtVmZxbXBGdnU1YzBpb052Q2g9fG5SNDdTRHM9dndBYk9paExoYnJ2UG0zYTRMdVJENTVfa1ZPYjF9XCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl',
  })
  @IsString()
  checkoutUrl: string;

  /**
   * The payment intent ID of the checkout session.
   */
  @ApiProperty({
    description: 'This is the payment intent ID',
    example: 'pi_3N8JFDBxRt0Gux4f0hArIthA',
  })
  @IsString()
  paymentIntentId: string;
}
