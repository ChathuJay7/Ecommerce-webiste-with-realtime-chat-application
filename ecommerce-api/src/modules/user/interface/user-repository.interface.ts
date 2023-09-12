import { IBaseRepositoy } from "../../../core/repositories/base/base-interface.repository";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entity/user.entity";

export const UserRepositoryInterface = 'IUserRepository';
export interface IUserRepository extends IBaseRepositoy<User> {

    findOneByResetToken(resetToken: string): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    update(id: string,updateUserDto: UpdateUserDto):Promise<User>;
}