import { Controller, Get, ParseIntPipe, ParseUUIDPipe, Patch, ValidationPipe } from '@nestjs/common';
import { Body, Delete, Inject, Param, Post, Put, UsePipes } from '@nestjs/common/decorators';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ApiAcceptedResponse, ApiBody, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger/dist';
import { ResponseSingleMsg } from 'src/core/interfaces/response-msg.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { IUser } from './interface/user-entity.interface';
import { UserService } from './user.service';
import { ClientProxy } from '@nestjs/microservices';

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(
        private userService: UserService,
        @Inject("USER_SERVICE") private readonly client: ClientProxy
    ){}

    //Get all the users
    @Get()
    @ApiOkResponse({
        description: "Retrieve all users successfully",
        type: [UserDto], 
    })
    @ApiBadRequestResponse({
        description: "Users cannot retrieve. Please try again" 
    })
    getAllUsers(): Promise<IUser[]>{
        return this.userService.getAllUsers();
    }

    //Get single user
    @Get(':id')
    @ApiOkResponse({
        description: "Retrieve user successfully",
        type: UserDto, 
    })
    @ApiNotFoundResponse({
        description: "User not found" 
    })
    getSingleUser(@Param('id', ParseUUIDPipe) id: string,): Promise<IUser> {
        return this.userService.getSingleUser(id);
    }

    //Create a new user
    @Post()
    @ApiCreatedResponse({
        description: "User registered successfully",
        type: CreateUserDto, 
    })
    @ApiBadRequestResponse({
        description: "User cannot create. Please try again" 
    })
    async createUser(@Body() createUserDto: CreateUserDto): Promise<IUser>{
        // this.client.emit('user_created', createUserDto);
        // return this.userService.createUser(createUserDto);

        const createdUser = await this.userService.createUser(createUserDto);
        this.client.emit('user_created', createdUser);
        return createdUser;
        
    }

    //Update the user details
    @Put(':id')
    @ApiOkResponse({
        description: "User updated Successfully", 
        type: UpdateUserDto,
    })
    @ApiNotFoundResponse({
        description: "User not found" 
    })
    async updateUser(@Param('id', ParseUUIDPipe) id: string , @Body() updateUserDto: UpdateUserDto):Promise<IUser>{
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        this.client.emit('user_updated', { id, updateUserDto });
        return updatedUser
    }

    //Filter User By firstName
    @Get('/filter/:name')
    @ApiOkResponse({
        description: "Users Filtered Succesfully "
    }
    )
    @ApiNotFoundResponse({
        description: "Users Not Found"
    })
    filterUserByName(@Param('name') name: string): Promise<IUser[]>{
        return this.userService.filterUserByName(name);
    }

    //Delete the user
    @Delete(':id')
    @ApiOkResponse({
        description: "User deleted successfully",
    })
    @ApiNotFoundResponse({
        description: "User not found" 
    })
    async deleteUser(@Param('id', ParseUUIDPipe) id: string,): Promise<ResponseSingleMsg>{
        const deletedUser = this.userService.deleteUser(id);
        this.client.emit('user_deleted', id);
        return deletedUser
    }

}
