import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
    
    @ApiProperty({
        description: 'This is the user\'s password',
        example: 'Fernando1234!',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
    
    @ApiProperty({
        description: 'This is the user\'s confirm password',
        example: 'Fernando1234!',
    })
    @IsNotEmpty()
    @IsString()
    confirmPassword: string;

    @ApiProperty({
        description: 'This is the user\'s reset token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXRodXJhajE3MTc1QGdtYWlsLmNvbSIsInN1YiI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjc5OTA2NzE1fQ.iBUutO4r7tM3Ir-ZWEmxYdE_MJl8CMHN06NJUMete5I',
    })
    @IsNotEmpty()
    @IsString()
    resetToken: string;
}