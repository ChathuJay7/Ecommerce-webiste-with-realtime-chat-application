import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator"


export class CreateProductDto {

    @ApiProperty({
        description: 'This is product name',
        example: 'Samesung galaxy Note20',
    })
    @IsNotEmpty()
    @IsString()
    name: string


    @ApiProperty({
        description: 'This is product color',
        example: 'silver',
    })
    @IsNotEmpty()
    @IsString()
    color: string


    @ApiProperty({
        description: 'This is product price',
        example: '355000',
    })
    @IsNotEmpty()
    @IsNumber()
    price: number


    @ApiProperty({
        description: 'This is product image',
        example: [
            'https://www.cnet.com/a/img/resize/b5908be315352c687beffe7bd573b89b0d874a2d/hub/2020/08/28/e2c94e50-3e9c-4723-ae4d-bdebca59261b/note20-mysticgreen.jpg?auto=webp&width=1200',
            'https://www.cnet.com/a/img/resize/6471fbffff324e9892ef04df3e17f2dc2942be1d/hub/2020/10/09/8fac8501-15ab-4fe1-aa05-4965690c6e6c/note-20-and-ultra.jpg?auto=webp&width=1200',
            'https://www.cnet.com/a/img/resize/df5e84f886cb850eb9500d954c63cf0568aa9df6/hub/2020/10/06/895510c7-41d0-44ed-8b1e-7bf579ac68b6/samsung-galaxy-s20-fe-5g-fan.jpg?auto=webp&width=1200'
        ],
    })
    @IsNotEmpty()
    image: string;


    @ApiProperty({
        description: 'This is product discount',
        example: '10',
    })
    @IsNotEmpty()
    @IsNumber()
    discount: number


    @ApiProperty({
        description: 'This is product description',
        example: 'Manufactured in 2021',
    })
    @IsNotEmpty()
    @IsString()
    description: string


    @ApiProperty({
        description: 'This is product quantity',
        example: '50',
    })
    @IsNotEmpty()
    @IsNumber()
    quantity: number

    
    @ApiProperty({
        description: 'This is category ID',
        example: 'e7f353c0-d682-4889-93b2-57287ff9b4b4',
    })
    @IsNotEmpty()
    @IsString()
    categoryId: string;

}