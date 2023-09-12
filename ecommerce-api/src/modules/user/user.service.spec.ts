import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositoryInterface } from './interface/user-repository.interface';
import { UserRole } from 'src/core/enums/user-roles';
import { IUser } from './interface/user-entity.interface';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUserObj: IUser = {
    id: '12a50bc0-83df-4bab-9ec5-d9f14aa6b393',
    email: 'ashenfernando@gmail.com',
    firstName: 'Ashen',
    lastName: 'Fernando',
    address: null,
    state: null,
    country: null,
    role: UserRole.CUSTOMER,
    password: '$2b$10$oxZdDtuuc/Z1MdJx7ntD7en6fAeQYvLpaomf209dM2Su/n9YHMqAy',
    resetToken: null,
    cart: null
  };

  const mockUserObjArr: IUser[] = [
    {
      id: '12a50bc0-83df-4bab-9ec5-d9f14aa6b393',
      email: 'ashenfernando@gmail.com',
      firstName: 'Ashen',
      lastName: 'Fernando',
      address: null,
      state: null,
      country: null,
      role: UserRole.CUSTOMER,
      password: '$2b$10$oxZdDtuuc/Z1MdJx7ntD7en6fAeQYvLpaomf209dM2Su/n9YHMqAy',
      resetToken: null,
      cart: null
    },
  ];

  let createUserDto = new CreateUserDto();
  createUserDto.email = 'johnanderson@gmail.com';
  createUserDto.firstName = 'John';
  createUserDto.lastName = 'Anderson';
  createUserDto.password = 'Anderson1234!';

  let updateUserDto = new UpdateUserDto();
  updateUserDto.firstName = 'John';
  updateUserDto.lastName = 'Anderson';
  updateUserDto.address = 'NO 4, Hotel Road, Mount Lavinia';
  updateUserDto.state = 'Colombo';
  updateUserDto.country = 'Sri Lanka';
  updateUserDto.role = 'CUSTOMER';
  updateUserDto.password = 'Anderson1234!';
  updateUserDto.resetToken = expect.any(String);

  const mockUserRepository = {
    findAll: jest.fn().mockReturnValue(mockUserObjArr),
    create: jest.fn().mockReturnValue(mockUserObj),
    update: jest.fn().mockReturnValue(mockUserObj),
    delete: jest.fn().mockReturnValue({ message: 'User deleted successfully' }),
    findOneById: jest.fn().mockReturnValue(mockUserObj),
    findOneByEmail: jest.fn().mockReturnValue(mockUserObj),
    findOneByResetToken: jest.fn().mockReturnValue(mockUserObj),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: `${UserRepositoryInterface}`,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined UsersService', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should be defined getAllUsers', () => {
      expect(service.getAllUsers).toBeDefined();
    });
    it('should call the getAllUsers method of the UserService & return the IUser[]', async () => {
      const actualResponse = await service.getAllUsers();
      expect(actualResponse).toEqual(mockUserObjArr);
      expect(mockUserRepository.findAll).toHaveBeenCalledWith();
    });
  });

  describe('getSingleUser', () => {
    const id = expect.any(String);
    it('should be defined getSingleUser', () => {
      expect(service.getSingleUser).toBeDefined();
    });
    it('should call the getSingleUser method of the UserService & return the IUser', async () => {
      const actualResponse = await service.getSingleUser(id);
      expect(actualResponse).toEqual(mockUserObj);
      expect(mockUserRepository.findOneById).toHaveBeenCalledWith(id);
    });
    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(mockUserRepository, 'findOneById').mockResolvedValue(null);
      await expect(service.getSingleUser(id)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.USER_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });

  describe('createUser', () => {
    it('should be defined createUser', () => {
      expect(service.createUser).toBeDefined();
    });
    it('create a user with a createUserDto, valid password & valid email & then return the IUser', async () => {
      jest.spyOn(mockUserRepository, 'findOneByEmail').mockResolvedValue(null);
      const actualResponse = await service.createUser(createUserDto);
      expect(actualResponse).toEqual(mockUserObj);
      //expect(mockUserRepository.create).toHaveBeenCalledWith(mockUserObj);
      expect(actualResponse.password).not.toBe(createUserDto.password);
      expect(createUserDto.email).toMatch(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
      expect(createUserDto.password).toMatch(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{9,}$/,
      );
    });
    it('should throw ConflictException when user already exists', async () => {
      jest
        .spyOn(mockUserRepository, 'findOneByEmail')
        .mockResolvedValue(mockUserObj);
      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new ConflictException({
          message: Messages.ERROR.USER_ALREADY_EXISTS,
          status_code: Status_Code.ERROR_CODE.ALREADY_EXISTS,
        }),
      );
    });
    it('should throw BadRequestException when password is not valid', async () => {
      const invalidPasswordDto: CreateUserDto = {
        email: 'johnanderson@gmail.com',
        firstName: 'John',
        lastName: 'Anderson',
        password: 'invalidpw',
      };
      jest.spyOn(mockUserRepository, 'findOneByEmail').mockReturnValue(null);
      await expect(service.createUser(invalidPasswordDto)).rejects.toThrow(
        new BadRequestException({
          message: Messages.ERROR.PASSWORD_NOT_VALID,
          status_code: Status_Code.ERROR_CODE.BAD_REQUEST,
        }),
      );
    });
    it('should throw BadRequestException when email is not valid', async () => {
      const invalidEmailDto: CreateUserDto = {
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Anderson',
        password: 'Anderson1234!',
      };
      jest.spyOn(mockUserRepository, 'findOneByEmail').mockReturnValue(null);
      await expect(service.createUser(invalidEmailDto)).rejects.toThrow(
        new BadRequestException({
          message: Messages.ERROR.EMAIL_NOT_VALID,
          status_code: Status_Code.ERROR_CODE.BAD_REQUEST,
        }),
      );
    });
  });

  describe('updateUser', () => {
    const id = expect.any(String);
    it('should be defined updateUser', () => {
      expect(service.updateUser).toBeDefined();
    });
    it('should call the updateUser method of the UserService with the correct DTO & return the IUser', async () => {
      jest
        .spyOn(mockUserRepository, 'findOneById')
        .mockResolvedValue(mockUserObj);
      const actualResponse = await service.updateUser(id, updateUserDto);
      expect(actualResponse).toEqual(mockUserObj);
      expect(mockUserRepository.update).toHaveBeenCalledWith(id, updateUserDto);
    });
    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(mockUserRepository, 'findOneById').mockReturnValue(null);
      await expect(service.updateUser(id, updateUserDto)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.USER_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });

  describe('deleteUser', () => {
    const id = expect.any(String);
    it('should be defined deleteUser', () => {
      expect(service.deleteUser).toBeDefined();
    });
    it('should call the deleteUser method of the UserService & return the message', async () => {
      jest
        .spyOn(mockUserRepository, 'findOneById')
        .mockReturnValue(mockUserObj);
      const expectedResponse = { message: 'User deleted successfully' };
      const actualResponse = await service.deleteUser(id);
      expect(actualResponse).toEqual(expectedResponse);
      expect(mockUserRepository.findOneById).toHaveBeenCalledWith(id);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
    });
    it('should throw a NotFoundException if user not found', async () => {
      jest.spyOn(mockUserRepository, 'findOneById').mockReturnValue(null);
      await expect(service.deleteUser(id)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.USER_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });

  describe('getSingleUserByEmail', () => {
    const email = mockUserObj.email;
    it('should be defined getSingleUserByEmail', () => {
      expect(service.getSingleUserByEmail).toBeDefined();
    });
    it('should call the getSingleUserByEmail method of the UserService & return the IUser', async () => {
      jest
        .spyOn(mockUserRepository, 'findOneByEmail')
        .mockReturnValue(mockUserObj);
      const actualResponse = await service.getSingleUserByEmail(email);
      expect(actualResponse).toEqual(mockUserObj);
      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith(email);
    });
    it('should throw a NotFoundException if user not found matching with email', async () => {
      jest.spyOn(mockUserRepository, 'findOneByEmail').mockResolvedValue(null);
      await expect(service.getSingleUserByEmail(email)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.USER_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });

  describe('getSingleUserById', () => {
    const id = expect.any(String);
    it('should be defined getSingleUserById', () => {
      expect(service.getSingleUserById).toBeDefined();
    });
    it('should call the getSingleUserById method of the UserService & return the IUser', async () => {
      jest
        .spyOn(mockUserRepository, 'findOneById')
        .mockReturnValue(mockUserObj);
      const actualResponse = await service.getSingleUserById(id);
      expect(actualResponse).toEqual(mockUserObj);
      expect(mockUserRepository.findOneById).toHaveBeenCalledWith(id);
    });
    it('should throw a NotFoundException if user not found matching with ID', async () => {
      jest.spyOn(mockUserRepository, 'findOneById').mockResolvedValue(null);
      await expect(service.getSingleUserById(id)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.USER_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });

  describe('getSingleUserByResetToken', () => {
    const resetToken = mockUserObj.resetToken;
    it('should be defined getSingleUserByResetToken', () => {
      expect(service.getSingleUserByResetToken).toBeDefined();
    });
    it('should call the getSingleUserByResetToken method of the UserService & return the IUser', async () => {
      const actualResponse = await service.getSingleUserByResetToken(
        resetToken,
      );
      expect(actualResponse).toEqual(mockUserObj);
      expect(mockUserRepository.findOneByResetToken).toHaveBeenCalledWith(
        resetToken,
      );
    });
    it('should throw a NotFoundException if user not found matching with resetToken', async () => {
      jest
        .spyOn(mockUserRepository, 'findOneByResetToken')
        .mockResolvedValue(null);
      await expect(
        service.getSingleUserByResetToken(resetToken),
      ).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.USER_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });
});
