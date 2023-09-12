import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateCartDto {
    // @ApiProperty({
    //     description: 'This is the user id',
    //     example: '1',
    // })
    // @IsNotEmpty()
    // @IsString()
    // userId: string;

    @ApiProperty({
        description: 'This is the user id',
        example: '595000',
    })
    @IsNotEmpty()
    @IsNumber()
    totalAmount: number;
}