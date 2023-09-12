import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {

  @ApiProperty({
    description: 'This is the user first name',
    example: 'Ashen',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'This is the user last name',
    example: 'Fernando',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'This is the user home address',
    example: 'No 60, Rajamalwatta Road, Battaramulla',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'This is the user state',
    example: 'Western',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'This is the user country',
    example: 'Sri Lanka',
  })
  @IsString()
  country: string;

  @ApiProperty({
    description: "This is the user's role in the system",
    example: 'CUSTOMER',
  })
  @IsString()
  role: string;

  @ApiProperty({
    description: 'This is the user password',
    example: 'Ashen1234@',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'This is the user reset password token',
    example: '',
  })
  @IsString()
  resetToken: string;
}
