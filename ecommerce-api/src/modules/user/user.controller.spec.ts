import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interface/user-entity.interface';
import { UserRole } from 'src/core/enums/user-roles';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

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

  const mockUserService = {
    getAllUsers: jest.fn().mockReturnValue(mockUserObjArr),
    getSingleUser: jest.fn().mockReturnValue(mockUserObj),
    createUser: jest.fn().mockReturnValue(mockUserObj),
    updateUser: jest.fn().mockReturnValue(mockUserObj),
    deleteUser: jest
      .fn()
      .mockReturnValue({ message: 'User deleted successfully' }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = app.get<UserController>(UserController);
  });

  it('should be defined UsersController', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should be defined getAllUsers', () => {
      expect(controller.getAllUsers).toBeDefined();
    });
    it('should call the getAllUsers method of the UserController & return the IUser[]', async () => {
      const actualResponse = await controller.getAllUsers();
      expect(actualResponse).toEqual(mockUserObjArr);
      expect(mockUserService.getAllUsers).toHaveBeenCalledWith();
    });
  });

  describe('getSingleUser', () => {
    it('should be defined getSingleUser', () => {
      expect(controller.getSingleUser).toBeDefined();
    });
    it('should call the getSingleUser method of the UserController with user ID and return the IUser', async () => {
      const id = expect.any(String);
      const actualResponse = await controller.getSingleUser(id);
      expect(actualResponse).toEqual(mockUserObj);
      expect(mockUserService.getSingleUser).toHaveBeenCalledWith(id);
    });
  });

  describe('createUser', () => {
    it('should be defined createUser', () => {
      expect(controller.createUser).toBeDefined();
    });
    it('should call the createUser method of the UserController with the correct DTO and return the IUser', async () => {
      const actualResponse = await controller.createUser(createUserDto);
      expect(actualResponse).toEqual(mockUserObj);
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUser', () => {
    it('should be defined updateUser', () => {
      expect(controller.updateUser).toBeDefined();
    });
    it('should call the updateUser method of the UserController with the correct user ID & DTO and return the IUser', async () => {
      const id = expect.any(String);
      const actualResponse = await controller.updateUser(
        id,
        updateUserDto,
      );
      expect(actualResponse).toEqual(mockUserObj);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        id,
        updateUserDto,
      );
    });
  });

  describe('deleteUser', () => {
    it('should be defined deleteUser', () => {
      expect(controller.deleteUser).toBeDefined();
    });
    it('should call the deleteUser method of the UserController with the correct user ID', async () => {
      const id = expect.any(String);
      const actualResponse = await controller.deleteUser(id);
      const expectedResponse = { message: 'User deleted successfully' };
      expect(actualResponse).toEqual(expectedResponse);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(id);
    });
  });
});
