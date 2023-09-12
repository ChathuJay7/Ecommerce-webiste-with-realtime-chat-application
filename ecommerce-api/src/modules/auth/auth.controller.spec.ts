import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ResponseSingleMsg } from 'src/core/interfaces/response-msg.interface';
import { MailService } from '../email/mail-service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from 'src/core/enums/user-roles';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IUser } from '../user/interface/user-entity.interface';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authMockService: AuthService;

  let createUserDto = new CreateUserDto();
  createUserDto.email = 'email1@gmail.com';
  createUserDto.password = 'Password$12';
  createUserDto.firstName = 'firstname';
  createUserDto.lastName = 'lastname';
  
  const forgetPasswordDto = new ForgetPasswordDto();
  forgetPasswordDto.email = 'smith@gmail.com';

  const resetPasswordDto = new ResetPasswordDto();
  resetPasswordDto.password = 'Smith123#';
  resetPasswordDto.confirmPassword = 'Smith123#';
  resetPasswordDto.resetToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXRodXJhajE3MTc1QGdtYWlsLmNvbSIsInN1YiI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjc5OTE5MzExfQ.OXtHjHtP4Xtne44XgXoOkmXdjJB9xlolI5TEGfM9nS4';

  const changePasswordDto = new ChangePasswordDto();
  changePasswordDto.oldPassword = 'Smith123#';
  changePasswordDto.password = 'Anderson1234!';

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
  };

  const authService = {

    userRegister: jest.fn((user) => {
      const savedUser = {
        id: 1,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
      };
      return Promise.resolve(savedUser);
    }),

    generateJwtToken: jest.fn(),

    forgetPassword: jest.fn((token) => {
      return {
        resetToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXRodXJhajE3MTc1QGdtYWlsLmNvbSIsInN1YiI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjc5OTE5MzExfQ.OXtHjHtP4Xtne44XgXoOkmXdjJB9xlolI5TEGfM9nS4',
        message: 'Reset Token sent',
        status_code: '201',
      };
    }),

    resetPassword: jest.fn((data) => {
      return {
        message: "Password reset successfully",
        status_code: "200" 
      }
    }),

    changeUserPassword: jest.fn((data) => {
      return {
        message: 'Successfully change password',
      };
    }),

  }; 


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: MailService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {}
        }
        ],
    })
    .overrideGuard(LocalAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<AuthController>(AuthController);
    authMockService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
 
    it('should have a register function', () => {
      expect(controller.register).toBeDefined();
    });

    it('should call the userRegister Method in authService with the Correct DTO', async () => {
      const registeredUser = await controller.register(createUserDto);

      expect(authMockService.userRegister).toHaveBeenCalledWith(createUserDto);
      expect(registeredUser).toEqual({ id: 1, ...createUserDto });

    });

    it('should return a user', async () => {
      const result = { id: "1", ...createUserDto };

      jest.spyOn(authMockService, 'userRegister').mockResolvedValue(mockUserObj);
      expect(await controller.register(createUserDto)).toBe(result);
    });

    it('should throw an error if the userRegister method in authService throws an error', async () => {
      authService.userRegister.mockRejectedValueOnce(new Error('Error'));
      expect(controller.register(createUserDto)).rejects.toThrowError('Error');
    });

  });

  describe('login', () => {

    it('should have a login function', () => {
      expect(controller.login).toBeDefined();
    });

    it('should return a JWT token if user login is successful', async () => {
      const req = { user: { id: 1, email: 'testuser@test.com' } };
      jest.spyOn(authMockService, 'generateJwtToken').mockResolvedValue({ access_token: 'testtoken' });
      expect(await controller.login(req)).toEqual({ access_token: 'testtoken' });
    });

    it('should throw an error if email does not exist', async () => {
      jest.spyOn(authMockService, 'generateJwtToken').mockRejectedValue(new Error('Email Not Exists, Try Again'));
      await expect(controller.login({})).rejects.toThrow('Email Not Exists, Try Again');
    });

  });

  describe('loggedInUser', () => {

    it('should have a loggedInUser function', () => {
      expect(controller.loggedInUser).toBeDefined();
    });

    it('should return the currently logged in user', async () => {
      const user = { id: 1, email: 'test@example.com' };
      const req = { user };

      const result = await controller.loggedInUser(req);

      expect(result).toEqual(user);
    });
  });

  describe('Forget Password',() => {
    it('should have forgetPassword function', () => {
      expect(controller.forgetPassword).toBeDefined();
    });

    it('should call authService.forgetPassword with the correct arguments', () => {
      controller.forgetPassword(forgetPasswordDto);
      expect(authService.forgetPassword).toHaveBeenCalledWith(
        forgetPasswordDto,
      );
    });

    it('should return the result of authService.forgetPassword', async () => {
      const result = await controller.forgetPassword(forgetPasswordDto);
      expect(result).toEqual({
        resetToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYXRodXJhajE3MTc1QGdtYWlsLmNvbSIsInN1YiI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjc5OTE5MzExfQ.OXtHjHtP4Xtne44XgXoOkmXdjJB9xlolI5TEGfM9nS4',
        message: 'Reset Token sent',
        status_code: '201',
      });
    });
  });

  describe('Reset Password', () => {
    it('should have resetPassword function', () => {
      expect(controller.resetPassword).toBeDefined();
    });

    it('should call authService.resetPassword with the correct arguments', () => {
      controller.resetPassword(resetPasswordDto);
      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
    });

    it('should return the result of authService.resetPassword', async () => {
      const result = await controller.resetPassword(resetPasswordDto);
      expect(result).toEqual({
        message: 'Password reset successfully',
        status_code: '200',
      });
    });
  });

  describe('Change Password', () => {
    const headers = { Authorization: 'Bearer token' };
    it('should have changeUserPassword function', () => {
      expect(controller.changeUserPassword).toBeDefined();
    });
    it('should call the authService.changeUserPassword method with the correct arguments', async () => {
      controller.changeUserPassword(headers, changePasswordDto);
      expect(authService.changeUserPassword).toHaveBeenCalledWith(
        changePasswordDto,
        headers
      );
    });
    it('should return the success message ', async () => {
      const result = await controller.changeUserPassword(headers, changePasswordDto);
      expect(result).toEqual({
        message: 'Successfully change password'
      });
    });
  });
});
