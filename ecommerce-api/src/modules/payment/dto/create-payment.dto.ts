import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  /**
   * The ID of the order.
   */
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
