import { UserRole } from 'src/core/enums/user-roles';
import { Cart } from 'src/modules/cart/entity/cart.entity';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  country: string;
  role: UserRole;
  password: string;
  resetToken: string;
  cart: Cart;
}
