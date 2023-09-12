import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateOrderDto {

    @ApiProperty({
        description: 'The status of the order',
        example: 'Payment Done',
      })
    @IsNotEmpty()
    status: string;

}