import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgetPasswordDto {
    
    @ApiProperty({
        description: 'This is the user email address',
        example: 'ashenfernando@gmail.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
}