import { ApiProperty } from "@nestjs/swagger";
import { ICart } from "../interfaces/cart.interface";

export class CartDto implements ICart {
    
    @ApiProperty({
        description: 'This is the cart id',
        example: '5aeb71cb-af41-4771-a716-7a83a04ca5d6',
    })
    id: string;
    
    @ApiProperty({
        description: 'This is the cart created date',
        example: '2023-04-20',
    })
    createdAt: Date;
    
    @ApiProperty({
        description: 'This is the total amount of cart',
        example: 3500000,
    })
    totalAmount: number;
}