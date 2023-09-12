import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { IBaseRepositoy } from "./base-interface.repository";

interface HasId {
    id: string;
}
export abstract class BaseAbstractRepositoryImpl<T extends HasId> implements IBaseRepositoy<T>{
  
    protected constructor(private entity: Repository<T>){     
    }

    async create(entity: T): Promise<T> {
        return await this.entity.save(entity);
    }

    // async findAll(): Promise<T[]> {
    //     return await this.entity.find();
    // }

    async findAll(options?: any): Promise<T[]> {
        return await this.entity.find(options);
    }

    async findOne(options?: any): Promise<T> {
        return await this.entity.findOne(options);
    }

    async findOneById(id: any): Promise<T> {    
    return await this.entity.findOneBy({id: id}); 
    }

    async delete(id: string): Promise<void> {
        await this.entity.delete(id);
    }

    async updates(entityToUpdate: T): Promise<T> {
        return await this.entity.save(entityToUpdate);
    }


    async filter(entityName?: string, filterDto?: { [key: string]: any }): Promise<T[]> {

        const queryBuilder = this.entity.createQueryBuilder();
        

        if (filterDto) {

            Object.entries(filterDto).forEach(([key, value]) => {
                //queryBuilder.andWhere(`${this.entity}.${key} = :${key}`, { [key]: value });
                //queryBuilder.andWhere(`${entityName}.${key} = :${key}`, { [key]: value });
                queryBuilder.andWhere(`${entityName}.${key} LIKE :${key}`, { [key]: `%${value}%` });

            });
 
        }

        const results = await queryBuilder.getMany();
        return results;
    }

    async paginate(paginateDto?: { [key: string]: any }): Promise<T[]> {
        
        const queryBuilder = this.entity.createQueryBuilder();

        if (paginateDto) {
            const page = parseInt(paginateDto.page) || 1;
            queryBuilder.offset((page - 1) * paginateDto.limit).limit(paginateDto.limit);
        }

        const results =  await queryBuilder.getMany();
        return results;
    }


}