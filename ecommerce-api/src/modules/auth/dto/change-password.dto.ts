import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {

  @ApiProperty({
    description: 'This is the user\'s old password',
    example: 'Ashen1234@',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'This is the user\'s new password',
    example: 'Fernando1234!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
