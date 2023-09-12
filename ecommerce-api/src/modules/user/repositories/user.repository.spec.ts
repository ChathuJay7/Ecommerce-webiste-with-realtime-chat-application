import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UserRole } from 'src/core/enums/user-roles';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entity/user.entity';

describe('UsersRepository', () => {
  let repository: UserRepository;

  const mockUserObj: User = {
    id: expect.any(Number),
    email: 'johnanderson@gmail.com',
    firstName: 'John',
    lastName: 'Anderson',
    password: expect.any(String),
    role: UserRole.CUSTOMER,
    resetToken: 'valid-token',
    address: '',
    state: '',
    country: '',
  };

  let updateUserDto = new UpdateUserDto();
  updateUserDto.firstName = 'John';
  updateUserDto.lastName = 'Anderson';
  updateUserDto.address = 'NO 4, Hotel Road, Mount Lavinia';
  updateUserDto.state = 'Colombo';
  updateUserDto.country = 'Sri Lanka';
  updateUserDto.role = UserRole.CUSTOMER;
  updateUserDto.password = 'Anderson1234!';
  updateUserDto.resetToken = expect.any(String);

  const mockUsersRepository = {
    findOneByResetToken: jest.fn().mockReturnValue(mockUserObj),
    findOneByEmail: jest.fn().mockReturnValue(mockUserObj),
    update: jest.fn().mockReturnValue(mockUserObj),
    findOneBy: jest.fn().mockReturnValue(mockUserObj),
    findOneById: jest.fn().mockReturnValue(mockUserObj),
    save: jest.fn().mockReturnValue(mockUserObj),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: UserRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined UsersRepository', () => {
    expect(repository).toBeDefined();
  });

  describe('findOneByResetToken', () => {
    it('should be defined the findOneByResetToken', () => {
      expect(mockUsersRepository.findOneByResetToken).toBeDefined();
    });
    it('should call the findOneByResetToken method of the UsersRepository & return the User entity match with reset token', async () => {
      const resetToken = mockUserObj.resetToken;
      const actualResponse = await repository.findOneByResetToken(resetToken);
      expect(actualResponse).toEqual(mockUserObj);
      expect(mockUsersRepository.findOneByResetToken).toHaveBeenCalledWith(
        resetToken,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should be defined the findOneByEmail', () => {
      expect(mockUsersRepository.findOneByEmail).toBeDefined();
    });
    it('should call the findOneByEmail method of the UsersRepository & return the User entity match with user email', async () => {
      const userEmail = mockUserObj.email;
      const actualResponse = await repository.findOneByEmail(userEmail);
      expect(actualResponse).toEqual(mockUserObj);
      expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(
        userEmail,
      );
    });
  });

  describe('update', () => {
    const id = expect.any(String);
    it('should be defined the update', () => {
      expect(mockUsersRepository.update).toBeDefined();
    });
    it('should call the update method of the UsersRepository & return the updated User entity match with ID', async () => {
      jest
        .spyOn(mockUsersRepository, 'findOneById')
        .mockResolvedValue(mockUserObj);
      const actualResponse = await repository.update(id, updateUserDto);
      expect(actualResponse).toEqual(mockUserObj);
      expect(mockUsersRepository.update).toHaveBeenCalledWith(
        id,
        updateUserDto,
      );
    });
  });
});
