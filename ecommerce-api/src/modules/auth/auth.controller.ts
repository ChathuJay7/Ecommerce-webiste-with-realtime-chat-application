import { Controller, Post, UseGuards, Headers, Request  } from '@nestjs/common';
import { Body, Get, Put } from '@nestjs/common/decorators';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ResponseSingleMsg } from 'src/core/interfaces/response-msg.interface';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse, ApiCreatedResponse, ApiConflictResponse, ApiBody, ApiBearerAuth, } from '@nestjs/swagger';
import { type } from 'os';
import { CreateUserDto } from '../user/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    //register user
    @Post('register')
    @ApiCreatedResponse({
        description: 'Created a User Succesfully'
    })
    @ApiBadRequestResponse({
        description: 'User Cannot Create, Please Try Again'
    })
    @ApiConflictResponse({
        description: 'User Already Exists'
    })
    async register(@Body() createUserDto: CreateUserDto){
        return this.authService.userRegister(createUserDto);
    };

    //login with guard
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBadRequestResponse({
        description: 'Email Not Exists, Try Again',
    })
    @ApiUnauthorizedResponse({
        description: 'Password is Incorrect, Try Again'
    })
    @ApiOkResponse({
        description: 'Login token generated Successfully'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error'
    })
    @ApiBody({ 
        description: 'Credentials for user login', 
        type: AuthLoginDto 
    })
    async login(@Request() req): Promise<any>{
        return this.authService.generateJwtToken(req.user);
    };

    //loggedIn user
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('loggedInUser')
    @ApiOkResponse({
        description: 'User Logged In Successfully'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal Server Error'
    })
    async loggedInUser(@Request() req): Promise<any> {
        return req.user;
    };


    @UseGuards(JwtAuthGuard)
    @Put('change-password')
    @ApiBearerAuth()
    @ApiOkResponse({
        description: "Password updated Successfully", 
        type: ChangePasswordDto,
    })
    @ApiNotFoundResponse({
        description: "User not found" 
    })
    @ApiBadRequestResponse({
        description: "Password cannot update. Please try again"
    })
    async changeUserPassword(@Headers() headers: any, @Body() changePasswordDto: ChangePasswordDto): Promise<ResponseSingleMsg> {
        return this.authService.changeUserPassword(changePasswordDto, headers);
    };


    @ApiOkResponse({ 
        status: 201, 
        description: 'Password reset email sent successfully',
        type: ForgetPasswordDto,
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: "Password reset rmail cannot send. Please try again"
    })
    @ApiNotFoundResponse({ 
        status: 404, 
        description: 'User not found' 
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    @Post('forget-password')
    async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto){
        return this.authService.forgetPassword(forgetPasswordDto);
    }


    @ApiOkResponse({ 
        status: 201, 
        description: 'Password updated successfully',
        type: ResetPasswordDto,
    })
    @ApiBadRequestResponse({
        status: 400, 
        description: "Password cannot update. Please try again"
    })
    @ApiNotFoundResponse({ 
        status: 404, 
        description: 'User not found' 
    })
    @ApiInternalServerErrorResponse({ 
        status: 500, 
        description: 'Internal server error' 
    })
    @Put('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto){
        return this.authService.resetPassword(resetPasswordDto);
    }
}
