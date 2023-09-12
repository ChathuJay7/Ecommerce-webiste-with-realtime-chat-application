import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCartItemDto {
    
    @ApiProperty({
        description: 'This is the cart item quantity',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
    
    // @ApiProperty({
    //     description: 'This is the cart item price',
    //     example: 1000,
    // })
    // @IsNotEmpty()
    // @IsNumber()
    // price: number;
    
    // @ApiProperty({
    //     description: 'This is the cart item quantity',
    //     example: "1",
    // })
    // @IsNotEmpty()
    // @IsString()
    // cartId: string;

    @ApiProperty({
        description: 'This is the product',
        example: '3efe3a4e-e401-4329-8adc-67bdff35ab7f',
    })
    @IsNotEmpty()
    productId: string;
}