import { Injectable } from "@nestjs/common/decorators";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { BaseAbstractRepositoryImpl } from "../../../core/repositories/base/base-abstract.repository";
import { UpdateUserDto } from "../dto/update-user.dto";
import { IUserRepository } from "../interface/user-repository.interface";
import { User } from "../entity/user.entity";

@Injectable()
export class UserRepository extends BaseAbstractRepositoryImpl<User> implements IUserRepository {

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>){
            super(usersRepository);
        }

        async findOneByResetToken(resetToken: any): Promise<User> {         
            return await this.usersRepository.findOneBy({resetToken});
        }

        public async findOneByEmail(email: any): Promise<User> {    
            return await this.usersRepository.findOneBy({email});
        }

        async update(userId: string, updateUserDto: any): Promise<User> {
            const entityToUpdate = await this.findOneById(userId);
            if (!entityToUpdate) {
              return null;
            }
            Object.assign(entityToUpdate, updateUserDto);
            return await this.usersRepository.save(entityToUpdate);
          }
    


}