import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNumber, IsNotEmpty, IsOptional } from "class-validator"

export class UpdateProductDto {

    @ApiProperty({
        description: 'This is product name',
        example: 'Samesung galaxy Note20',
    })
    @IsString()
    name: string


    @ApiProperty({
        description: 'This is product color',
        example: 'silver',
    })
    @IsString()
    color: string


    @ApiProperty({
        description: 'This is product price',
        example: '355000',
    })
    @IsNumber()
    price: number


    @ApiProperty({
        description: 'This is product image',
        example: 'https://fdn2.mobgsm.com/vv/bigpic/samsung-galaxy-note20-5g-r.jpg',
    })
    @IsString()
    image: string


    @ApiProperty({
        description: 'This is product discount',
        example: '10',
    })
    @IsNumber()
    discount: number


    @ApiProperty({
        description: 'This is product description',
        example: 'Manufactured in 2021',
    })
    @IsString()
    description: string


    @ApiProperty({
        description: 'This is product quantity',
        example: '50',
    })
    @IsNumber()
    quantity: number

    @ApiProperty({
        description: 'This is category ID',
        example: 'e7f353c0-d682-4889-93b2-57287ff9b4b4',
    })
    @IsString()
    categoryId: string;

}