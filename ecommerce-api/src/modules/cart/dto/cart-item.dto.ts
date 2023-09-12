import { ApiProperty } from "@nestjs/swagger";
import { CartDto } from "src/modules/cart/dto/cart.dto";
import { ProductDto } from "src/modules/product/dto/product.dto";

export class CartItemDto {

    @ApiProperty({
        description: 'This is the cart item id',
        example: '9577eb51-a344-4f13-96e4-84e0688b7bc6',
    })
    id: string;


    @ApiProperty({
        description: 'This is the cart item quantity',
        example: 2,
    })
    quantity: number;


    @ApiProperty({
        description: 'This is the cart item price',
        example: 425000,
    })
    price: number;


    @ApiProperty({
        description: 'This is the cart item id',
        example: CartDto,
    })
    cart: CartDto;


    @ApiProperty({
        description: 'This is the product id',
        example: ProductDto,
    })
    product: ProductDto;
}