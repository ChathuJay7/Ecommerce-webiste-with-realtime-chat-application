import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'This is the user email address',
    example: 'ashenfernando@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'This is the user first name',
    example: 'Ashen',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'This is the user last name',
    example: 'Fernando',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'This is the user password',
    example: 'Ashen1234@',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
