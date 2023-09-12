import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { ResponseSingleMsg } from "../../../core/interfaces/response-msg.interface";
import { User } from "../entity/user.entity";

export interface UserServiceInterface {
    getAllUsers(): Promise<User[]>;
    getSingleUser(userId: string | number): Promise<User>;
    createUser(createUserDto: CreateUserDto): Promise<CreateUserDto>;
    updateUser(userId: string | number, updateUserDto: UpdateUserDto): Promise<UpdateUserDto>;
    deleteUser(userId: string | number): Promise<ResponseSingleMsg>;
    getSingleUserByEmail(email: string): Promise<User>;
    getSingleUserById(userId: string | number): Promise<User>;
    getSingleUserByResetToken(userResetToken: string): Promise<User>;

}