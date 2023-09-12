import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateCartItemDto {
    
    @ApiProperty({
        description: 'This is the cart item quantity',
        example: 2,
    })
    @IsNotEmpty()
    @IsNumber()
    quantity?: number;


    // @ApiProperty({
    //     description: 'This is the cart item price',
    //     example: 1000,
    // })
    // @IsNotEmpty()
    // @IsNumber()
    // @IsOptional()
    // price?: number;

}