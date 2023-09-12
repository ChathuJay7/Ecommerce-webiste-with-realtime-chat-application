import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class CreateOrderItemDto {

    @ApiProperty({
        description: 'The product id',
        example: '1',
        type: String
    })
    @IsNotEmpty()
    productId: string;

    @ApiProperty({
        description: 'Quantity',
        example: '2'
    })
    @IsNotEmpty()
    quantity: number;

    // @ApiProperty({
    //     description: 'Unit Price',
    //     example: '150.00'
    // })
    // @IsNotEmpty()
    // unitPrice: number;

}
