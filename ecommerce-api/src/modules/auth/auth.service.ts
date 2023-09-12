import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { comparePassword, passwordEncrypt } from 'src/core/utils/password-encryption';
import getConfig from '../../core/config/configurations'
import { ResponseSingleMsg } from 'src/core/interfaces/response-msg.interface';
import { MailService } from 'src/modules/email/mail-service';
import { Messages } from 'src/core/constants/messages';
import { Status_Code } from 'src/core/constants/status-codes';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private mailService: MailService){

        }

    updateUserDto: UpdateUserDto;

    //register user
    async userRegister(createUserDto: CreateUserDto){

        const user = await this.userService.createUser(createUserDto);

        return user;
    }

    //validateusercredentials
    async validateUserCreds(email: string, password: string): Promise<any>{
        const user = await this.userService.getSingleUserByEmail(email);

        if(!user){
            //throw new BadRequestException('Email Not Exists');
            throw new UnauthorizedException({message: Messages.ERROR.INVALID_CREDENTIALS, status_code: Status_Code.ERROR_CODE.INVALID_CREDENTIALS});
        }

        if(!await bcrypt.compare(password, user.password)){
            // throw new UnauthorizedException('Invalid Password');
            throw new UnauthorizedException({message: Messages.ERROR.INVALID_CREDENTIALS, status_code: Status_Code.ERROR_CODE.INVALID_CREDENTIALS});
        }
        
        return user;
    }

    //generate jwt token
    async generateJwtToken(user: any){

        const payload = {
            userId: user.id, 
            role: user.role
        };

        return {
            access_token: this.jwtService.sign(payload)
        };

    }

    // Change Password
    async changeUserPassword(changePasswordDto: ChangePasswordDto, headers:any): Promise<ResponseSingleMsg>{

        const headerToken = headers.authorization.split(" ")[1];
        const decoded: any = this.jwtService.decode(headerToken);
        const userId = decoded.userId;

        const user = await this.userService.getSingleUserById(userId);

        if (!user) {
            //throw new HttpException(`User not Found`, HttpStatus.UNAUTHORIZED);
            throw new NotFoundException({message: Messages.ERROR.USER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
        }

        if(! await comparePassword(changePasswordDto.oldPassword, user.password)){
            //throw new HttpException(`Old password not match`, HttpStatus.BAD_REQUEST);
            throw new BadRequestException({message: Messages.ERROR.OLD_PASSWORD_NOT_MATCHED, status_code: Status_Code.ERROR_CODE.BAD_REQUEST});
        }

        const passwordValidRegex = /^(?!.*(.)\1\1)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{9,}$/;
        if(!changePasswordDto.password.match(passwordValidRegex)){
            //throw new HttpException(`Password not valid`, HttpStatus.BAD_REQUEST);
            throw new BadRequestException({message: Messages.ERROR.PASSWORD_NOT_VALID, status_code: Status_Code.ERROR_CODE.BAD_REQUEST});
        }

        // const password = changePasswordDto.password;
        // await this.usersService.updateUser(user.id, {...this.updateUserDto, password});

        const password = passwordEncrypt(changePasswordDto.password);
        await this.userService.updateUser(user.id, { ...this.updateUserDto, password});
        
        //return {message: "Successfully change password"};
        return { message: Messages.SUCCESS.PASSWORD_UPDATED }

    }


    // Forget Password
    async forgetPassword(forgetPasswordDto: ForgetPasswordDto){
        
            const email = forgetPasswordDto.email;
            const user = await this.userService.getSingleUserByEmail(email);
            

            if(!user){

                throw new NotFoundException({message: Messages.ERROR.USER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
            }


            const payload = { email: user.email, sub: user.id, role: user.role };
            const resetToken = this.jwtService.sign(payload);

            const resetPasswordUrl = `${getConfig().APP.clientUrl}reset-password?token=${resetToken}`;
            const subject = "Verify your email address";
            const html = `<p>Click the link below to verify your email address:</p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a>`;
            this.mailService.sendEmail(email, subject, html);        

            await this.userService.updateUser(user.id, { ...this.updateUserDto, resetToken});

            return {resetToken: resetToken, message: Messages.SUCCESS.RESET_PASSWORD_EMAIL_SEND_SUCCESSFULLY, status_code: Status_Code.SUCCESS_CODE.CREATED_SUCCESSFULLY};

    }


    // Reset Password
    async resetPassword(resetPasswordDto: ResetPasswordDto){


        if(resetPasswordDto.password != resetPasswordDto.confirmPassword){

            throw new BadRequestException({ 
                message: Messages.ERROR.CONFIRM_PASSWORD_NOT_MATCHED, 
                status_Code: Status_Code.ERROR_CODE.CONFIRM_PASSWORD_NOT_MATCHED 
            });
        }


        const user = await this.userService.getSingleUserByResetToken(resetPasswordDto.resetToken);
        
        if(!user){
            throw new NotFoundException({message: Messages.ERROR.USER_NOT_FOUND, status_code: Status_Code.ERROR_CODE.NOT_FOUND});
        }

        if( resetPasswordDto.resetToken === user.resetToken){

            const passwordValidRegex = /^(?!.*(.)\1\1)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{9,}$/;
            if(!resetPasswordDto.password.match(passwordValidRegex)){
                throw new BadRequestException({ 
                    message: Messages.ERROR.PASSWORD_NOT_VALID, 
                    status_Code: Status_Code.ERROR_CODE.BAD_REQUEST 
                });
            }

            const password = passwordEncrypt(resetPasswordDto.password);
            await this.userService.updateUser(user.id, { ...this.updateUserDto, password});

            // return {message: "password updated successfully"};
            return { message: Messages.SUCCESS.PASSWORD_UPDATED, status_code: Status_Code.SUCCESS_CODE.UPDATED_SUCCESSFULLY }
            
        }

}


}
