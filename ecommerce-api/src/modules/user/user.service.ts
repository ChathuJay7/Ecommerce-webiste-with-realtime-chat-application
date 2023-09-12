import { BadRequestException, ConflictException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { ResponseSingleMsg } from 'src/core/interfaces/response-msg.interface';
import { passwordEncrypt } from 'src/core/utils/password-encryption';
import { Repository } from 'typeorm';
import { IUserRepository, UserRepositoryInterface } from './interface/user-repository.interface';
import { UserServiceInterface as IUserService } from './interface/user-service.interface';
import { BaseAbstractRepositoryImpl } from '../../core/repositories/base/base-abstract.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interface/user-entity.interface';
import { User } from './entity/user.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService implements IUserService{
  constructor(
    @Inject(`${UserRepositoryInterface}`)
    private readonly userRepository: IUserRepository,

    @Inject("USER_SERVICE") private readonly client: ClientProxy
  ) {}

  //Get all the users
  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  //Get single user
  async getSingleUser(userId: string): Promise<IUser> {
    console.log(userId);
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException({message: Messages.ERROR.USER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
    }
    console.log(userId);
    return user;
  }

  //Create a new user
  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const existingUser = await this.userRepository.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException({message: Messages.ERROR.USER_ALREADY_EXISTS, status_code: Status_Code.ERROR_CODE.ALREADY_EXISTS})
    }

    const emailValidRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordValidRegex =
      /^(?!.*(.)\1\1)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{9,}$/;

    if (!createUserDto.email.match(emailValidRegex)) {
      throw new BadRequestException({message: Messages.ERROR.EMAIL_NOT_VALID, status_code: Status_Code.ERROR_CODE.BAD_REQUEST});
    }

    if (!createUserDto.password.match(passwordValidRegex)) {
      throw new BadRequestException({message: Messages.ERROR.PASSWORD_NOT_VALID, status_code: Status_Code.ERROR_CODE.BAD_REQUEST});
    }

    const password = passwordEncrypt(createUserDto.password);

    const user = new User();
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.password = password;

    // this.client.emit('user_created', user);

    return await this.userRepository.create(user);
    //await this.userRepository.save({ ...createUserDto, password });
  }

  //Update the user details
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException({message: Messages.ERROR.USER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
    }

    // const password = passwordEncrypt(updateUserDto.password);

    const updatedUser = await this.userRepository.update(userId, updateUserDto);
    // const updatedUser = await this.userRepository.save({
    //   ...user,
    //   ...updateUserDto,
    // });
    return updatedUser;
  }

  //Delete the user
  async deleteUser(userId: string): Promise<ResponseSingleMsg> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException({message: Messages.ERROR.USER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
    }
    await this.userRepository.delete(userId);
    return { message: 'User deleted successfully' };
  }

  //Get user by email
  async getSingleUserByEmail(userEmail: string): Promise<IUser> {
    const email = await this.userRepository.findOneByEmail(userEmail);
    if (!email) {
      throw new NotFoundException({message: Messages.ERROR.USER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
    }
    return email;
  }

  //Get user by id
  async getSingleUserById(userId: string): Promise<IUser> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException({message: Messages.ERROR.USER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
    }
    return user;
  }

  //Get user by token
  async getSingleUserByResetToken(userResetToken: string): Promise<IUser> {
    const user = await this.userRepository.findOneByResetToken(userResetToken);
    if (!user) {
      throw new NotFoundException({message: Messages.ERROR.USER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
    }
    return user;
  }

  //Filter User by firstName
  async filterUserByName(userName: string): Promise<IUser[]> {

    const filterDto = {
      firstName: userName
    }
    const user = await this.userRepository.filter('user', filterDto);
    if (!user || user.length === 0) {
      throw new NotFoundException({message: Messages.ERROR.USER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
    }
    return user;
  }
}
