import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefundPaymentDto {
  /**
   * The ID of the payment.
   */
  @ApiProperty({
    description: 'This is the payment id',
    example: '12a50bc0-83df-4bab-9ec5-d9f14aa6b393',
  })
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  /**
   * The reason of the refund.
   */
  @ApiProperty({
    description: 'This is the payment refund reason',
    example: 'Sample message goes here',
  })
  @IsNotEmpty()
  @IsString()
  reason: string;
}
