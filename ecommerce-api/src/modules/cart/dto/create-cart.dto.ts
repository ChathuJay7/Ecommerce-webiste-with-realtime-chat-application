import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCartDto {
    // @ApiProperty({
    //     description: 'This is the user id',
    //     example: '1',
    // })
    // @IsNotEmpty()
    // @IsString()
    // userId: string;

    @ApiProperty({
        description: 'This is array of products',
        example: [
            {
                productId: "28dc4217-642f-4d6c-8d94-6ad50c005ef9",
                quantity: 2
            },
            {
                productId: "3efe3a4e-e401-4329-8adc-67bdff35ab7f",
                quantity: 3
            },
        ],
    })
    @IsNotEmpty()
    cartItems: Array<{
        productId: string;
        quantity: number;
    }>;
}