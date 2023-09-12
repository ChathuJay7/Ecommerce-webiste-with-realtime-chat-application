import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/core/enums/user-roles';
import { Column, Entity, Generated, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../interface/user-entity.interface';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from 'src/modules/cart/entity/cart.entity';

@Entity()
export class User implements IUser {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ default: UserRole.CUSTOMER })
  role: UserRole;

  @Column()
  password: string;

  @Column({ nullable: true })
  resetToken: string;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

}
