import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateOrderDto {

      @ApiProperty({
        description: 'CartId from the Cart Module',
        example: '28dc4217-642f-4d6c-8d94-6ad50c005ef9',
      })
      @IsNotEmpty()
      cartId: string;

    }