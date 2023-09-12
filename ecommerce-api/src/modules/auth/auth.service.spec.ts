import { BadRequestException, HttpException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { MailService } from '../email/mail-service';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from "bcrypt";
import { ForgetPasswordDto } from './dto/forget-password.dto';
import getConfig from '../../core/config/configurations'
import { comparePassword, passwordEncrypt } from '../../core/utils/password-encryption';
import * as utils from '../../core/utils/password-encryption';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;

  jest.mock('../../core/utils/passwordEncryption', () => ({
    passwordEncrypt: jest.fn(),
    comparePassword: jest.fn(),
  }));

  const authMockService = {
    userRegister: jest.fn().mockImplementation(),
  }

  const userMockService = {
    
    getSingleUserByEmail: jest.fn().mockImplementation(),
    getSingleUserByResetToken: jest.fn().mockImplementation(),
    updateUser:  jest.fn().mockImplementation(),
    createUser: jest.fn().mockImplementation(),
    getSingleUserById: jest.fn().mockImplementation(),
    split: jest.fn().mockImplementation(),
  }

  const jwtMockService = {
    
    sign: jest.fn().mockImplementation(),
    decode: jest.fn().mockImplementation()
  }
  
  const mailMockService = {
    sendEmail : jest.fn().mockImplementation()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userMockService
        },
        {
            provide: MailService,
            useValue: mailMockService
        },
        {
            provide: JwtService,
            useValue: jwtMockService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('userRegister', () => {
    it('should register a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Duck',
        lastName: 'Dunster',
        email: 'wdedw@gmail.com',
        password: 'ValidPassword1$',
      };

      const mockUser = { id: expect.any(Number),email: 'wdedw@gmail.com', firstName: 'John',lastName: 'Anderson',password: expect.any(String),role: "admin", resetToken: 'valid-token' };
      jest.spyOn(userMockService, 'createUser').mockResolvedValueOnce(mockUser);
     
      const user = await service.userRegister(createUserDto);
      expect(user).toEqual(mockUser);
      expect(user.email).toEqual(createUserDto.email);
    });


    it('should return the registered user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Duck',
        lastName: 'Doe',
        email: 'wdedw@gmail.com',
        password: 'ValidPassword1$',
      };

      const mockUser = { id: expect.any(Number),email: 'wdedw@gmail.com', firstName: 'John',lastName: 'Anderson',password: expect.any(String),role: "admin", resetToken: 'valid-token' };
      jest.spyOn(userMockService, 'createUser').mockResolvedValueOnce(mockUser);
      
      const user = await service.userRegister(createUserDto);
      expect(user.email).toEqual(mockUser.email);
      expect(user.firstName).toEqual(mockUser.firstName);
      expect(user.lastName).toEqual(mockUser.lastName);
      expect(user.password).toBe(mockUser.password);
    });
  });

  describe('generateJwtToken', () => {

    it('should generate a JWT token', async () => {
      const user = { id: 1 };
      const token = 'generated_token';
      jest.spyOn(jwtMockService, 'sign').mockReturnValue(token);

      const result = await service.generateJwtToken(user);
      expect(jwtMockService.sign).toHaveBeenCalledWith({ userId: user.id });
      expect(result).toEqual({ access_token: token });
    });

    it('should return an access token', async () => {
      const user = { id: 1 };
      const mockToken = 'mockToken';
      (jwtMockService.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await service.generateJwtToken(user);
      expect(result.access_token).toEqual(mockToken);
      expect(jwtMockService.sign).toHaveBeenCalledWith({ userId: user.id });
    });

  });

  describe('validateUserCreds', () => {
    it('should throw an UnauthorizedException if email not exists', async () => {

      jest.spyOn(userMockService, 'getSingleUserByEmail').mockResolvedValue(undefined);
      await expect(service.validateUserCreds('invalid-email@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if password is incorrect', async () => {
      const user = {
        id: 1,
        email: 'wdedw@gmail.com',
        password: await bcrypt.hash('ValidPassword1$', 10),
      };
      jest.spyOn(userMockService, 'getSingleUserByEmail').mockResolvedValue(user);
      await expect(service.validateUserCreds(user.email, 'wrong-password')).rejects.toThrow(UnauthorizedException);
    });

    it('should return the user if email and password are correct', async () => {
      const user = {
        id: 1,
        email: 'wdedw@gmail.com',
        password: await bcrypt.hash('ValidPassword1$', 10),
      };
      jest.spyOn(userMockService, 'getSingleUserByEmail').mockResolvedValue(user);
      const result = await service.validateUserCreds(user.email, 'ValidPassword1$');
      expect(result).toEqual(user);
    });

  });


  describe("Forget Password",() => {

    it('should send a reset password email and update the user with a reset token and return the expected response', async () => {
      // Arrange
      const forgetPasswordDto: ForgetPasswordDto = {
        email: 'johnanderson@gmail.com'
      };
      const mockUser = {
        id: expect.any(Number),
        email: 'johnanderson@gmail.com',
        firstName: 'John',
        lastName: 'Anderson',
        password: expect.any(String),
        role: 'admin',
        resetToken: 'valid-token'
      };
      const resetToken = 'valid-token';
      jest.spyOn(userMockService, 'getSingleUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(userMockService, 'updateUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtMockService, 'sign').mockReturnValue(resetToken);
      jest.spyOn(mailMockService, 'sendEmail').mockResolvedValue(undefined);
    
      // Act
      const result = await service.forgetPassword(forgetPasswordDto);
    
      // Assert
      expect(mailMockService.sendEmail).toHaveBeenCalledWith(
        'johnanderson@gmail.com',
        'Verify your email address',
        `<p>Click the link below to verify your email address:</p><a href="${getConfig().APP.clientUrl}verify?token=${resetToken}">${getConfig().APP.clientUrl}verify?token=${resetToken}</a>`
      );
      expect(userMockService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({ resetToken })
      );
      expect(result).toEqual({
        resetToken: resetToken,
        message: Messages.SUCCESS.RESET_PASSWORD_EMAIL_SEND_SUCCESSFULLY,
        status_code: Status_Code.SUCCESS_CODE.CREATED_SUCCESSFULLY
      });
    });


    it('should throw NotFoundException when user with given email is not found', async () => {

      const forgetPasswordDto: ForgetPasswordDto = {
        email: 'johnanderson1@gmail.com'
      }

      const mockUser = { id: expect.any(Number),email: 'johnanderson@gmail.com', firstName: 'John',lastName: 'Anderson',password: expect.any(String),role: "admin", resetToken: 'valid-token' };
      jest.spyOn(userMockService, 'getSingleUserByEmail').mockResolvedValue(null);

      await expect(service.forgetPassword(forgetPasswordDto)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.USER_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );

    });


  });


  describe("Reset Password" ,() => {


    it('should update user password when resetToken matches', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        password: 'ValidPassword1$',
        confirmPassword: 'ValidPassword1$',
        resetToken: 'valid-token',
      };

      const mockUser = { id: expect.any(Number),email: 'johnanderson@gmail.com', firstName: 'John',lastName: 'Anderson',password: expect.any(String),role: "admin", resetToken: 'valid-token' };
      jest.spyOn(userMockService, 'getSingleUserByResetToken').mockResolvedValueOnce(mockUser);
      jest.spyOn(userMockService, 'updateUser').mockResolvedValueOnce(mockUser);
    
      const result = await service.resetPassword(resetPasswordDto);
    
      expect(result).toEqual({
        message: Messages.SUCCESS.PASSWORD_UPDATED,
        status_code: Status_Code.SUCCESS_CODE.UPDATED_SUCCESSFULLY,
      });

    });


    it('should throw BadRequestException when password and confirmPassword do not match', async () => {
      // Arrange
      const resetPasswordDto = {
        password: 'ValidPassword1$',
        confirmPassword: 'InvalidPassword1$',
        resetToken: 'valid-token',
      };
    
      // Act and assert
      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        new BadRequestException({
          message: Messages.ERROR.CONFIRM_PASSWORD_NOT_MATCHED,
          status_code: Status_Code.ERROR_CODE.CONFIRM_PASSWORD_NOT_MATCHED,
        })
      );
      
    });


    it('should throw NotFoundException when user with given email is not found', async () => {

      const resetPasswordDto: ResetPasswordDto = {
        password: 'ValidPassword1$',
        confirmPassword: 'ValidPassword1$',
        resetToken: 'invalid-token',
      };

      const mockUser = { id: expect.any(Number),email: 'johnanderson@gmail.com', firstName: 'John',lastName: 'Anderson',password: expect.any(String),role: "admin", resetToken: 'valid-token' };
      jest.spyOn(userMockService, 'getSingleUserByEmail').mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.USER_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );

    });


    it('should throw BadRequestException when password is invalid', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        password: 'invalid',
        confirmPassword: 'invalid',
        resetToken: 'valid-token',
      };
    
      const mockUser = { id: expect.any(Number), email: 'johnanderson@gmail.com', firstName: 'John', lastName: 'Anderson', password: expect.any(String), role: 'admin', resetToken: 'valid-token' };
    
      jest.spyOn(userMockService, 'getSingleUserByResetToken').mockResolvedValueOnce(mockUser);
    
      const passwordValidRegex = /^(?!.*(.)\1\1)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{9,}$/;
    
      expect(resetPasswordDto.password).not.toMatch(passwordValidRegex);
    
      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        new BadRequestException({
          message: Messages.ERROR.PASSWORD_NOT_VALID,
          status_code: Status_Code.ERROR_CODE.BAD_REQUEST
        })
      );

    });


  });


  describe("Change Password" ,() => {
    const headers = {
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJpYXQiOjE2Nzk4OTgwNzZ9.BeagZQRoWvTdY3gSRZPrRsSBT5SajDkLl7XzwpKKR6o',
    };
    const userId = 123;

    it('should change the user password when all arguments are correct', async () => {
      const changePasswordDto = {
        oldPassword: 'OldPassword123!',
        password: 'NewPassword123!'
      };
      const user = {
        id: 1,
        password: 'OldPassword123!'
      };
      //(utils.comparePassword as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtMockService, 'decode').mockResolvedValueOnce(1);
      jest.spyOn(userMockService, 'getSingleUserById').mockResolvedValueOnce(user);
      //jest.spyOn(usersMockService, 'comparePassword').mockResolvedValueOnce(true);
      jest.spyOn(userMockService, 'updateUser').mockResolvedValueOnce(user);

      const result = await service.changeUserPassword(changePasswordDto, headers);
      expect(userMockService.getSingleUserById).toHaveBeenCalledWith(1);
      expect(utils.comparePassword).toHaveBeenCalledWith('OldPassword123!', 'OldPassword123!');
      expect(utils.passwordEncrypt).toHaveBeenCalledWith('NewPassword123!');
      expect(userMockService.updateUser).toHaveBeenCalledWith(1, { password: await bcrypt.hash('NewPassword123!', 10) });
      expect(result).toEqual({ message: Messages.SUCCESS.PASSWORD_UPDATED });
    });


    it('should throw a NotFoundException if user not found', async () => {
      const changePasswordDto: ChangePasswordDto = {
        oldPassword: 'InvalidPassword1$',
        password: 'ValidPassword1$'
      };
      jest.spyOn(jwtMockService, 'decode').mockResolvedValue(userId);
      jest.spyOn(userMockService, 'getSingleUserById').mockResolvedValue(null);
      await expect(service.changeUserPassword(changePasswordDto, headers)).rejects.toThrow(
        new NotFoundException({
          message: Messages.ERROR.USER_NOT_FOUND,
          status_code: Status_Code.ERROR_CODE.NOT_FOUND,
        }),
      );
    });

    it('should throw BadRequestException if the old password is not correct', async () => {
      const changePasswordDto = {
        oldPassword: 'wrongPassword',
        password: 'NewPassword123!'
      };
      const user = {
        id: 1,
        password: 'oldPassword123'
      };
      jest.spyOn(userMockService, 'getSingleUserById').mockResolvedValueOnce(user);
      await expect(service.changeUserPassword(changePasswordDto, headers)).rejects.toThrow(
        new BadRequestException({
          message: "Invalid old password",
          status_code: Status_Code.ERROR_CODE.BAD_REQUEST,
        }),
      );
    });

    it('should throw BadRequestException if the new password is not valid', async () => {
      const changePasswordDto = {
        oldPassword: 'OldPassword123!',
        password: 'weakpassword'
      };
      const user = {
        id: userId,
        password: 'OldPassword123!'
      };
      jest.spyOn(userMockService, 'getSingleUserById').mockResolvedValueOnce(user);
      await expect(service.changeUserPassword(changePasswordDto, headers)).rejects.toThrow(
        new BadRequestException({
          message: "Invalid old password",
          status_code: Status_Code.ERROR_CODE.BAD_REQUEST,
        }),
      );
    });


  });


});
