import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthLoginDto {

    @ApiProperty({
        description: 'This is the user email address',
        example: 'ashenfernando@gmail.com',
      })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'This is the user\'s password',
        example: 'Ashen1234@',
      })
    @IsNotEmpty()
    @IsString()
    password: string;
}