import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/core/enums/user-roles';
import { IUser } from '../interface/user-entity.interface';
import { Cart } from 'src/modules/cart/entity/cart.entity';

export class UserDto implements IUser {
  @ApiProperty({
    description: 'This is the user id',
    example: '1fsevgsf-1fsevgsf-1fsevgsf-1fsevgsf',
  })
  id: string;

  @ApiProperty({
    description: 'This is the user email address',
    example: 'ashenfernando@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'This is the user first name',
    example: 'Ashen',
  })
  firstName: string;

  @ApiProperty({
    description: 'This is the user last name',
    example: 'Fernando',
  })
  lastName: string;

  @ApiProperty({
    description: 'This is the user home address',
    example: 'No 60, Rajamalwatta Road, Battaramulla',
  })
  address: string;

  @ApiProperty({
    description: 'This is the user state',
    example: 'Western',
  })
  state: string;

  @ApiProperty({
    description: 'This is the user country',
    example: 'Sri Lanka',
  })
  country: string;

  @ApiProperty({
    description: "This is the user's role in the system",
    example: 'CUSTOMER',
  })
  role: UserRole;

  @ApiProperty({
    description: 'This is the user hashed password',
    example: '$2b$10$s.NDt6RJWEM182VA2UxUh.9MB8t/yqmSp1Z05mQO.GgeesM72qT1.',
  })
  password: string;

  @ApiProperty({
    description: 'This is the user reset password token',
    example: '',
  })
  resetToken: string;

  @ApiProperty({
    description: 'This is the user cart',
    example: '',
  })
  cart: Cart
}
