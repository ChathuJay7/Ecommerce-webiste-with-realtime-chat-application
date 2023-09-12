import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDto {
  /**
   * The status of the payment.
   */
  @ApiProperty({
    description: 'This is the payment status',
    example: 'SUCCESS',
  })
  @IsString()
  @IsOptional()
  status?: string;

  /**
   * The paymentIntentId of the payment.
   */
  @ApiProperty({
    description:
      'This is the paymentIntentId sending by the stripe webhook when checkout session is completed',
    example: 'pi_3N6Vq2BxRt0Gux4f0Wfgs7Lc',
  })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;
}
