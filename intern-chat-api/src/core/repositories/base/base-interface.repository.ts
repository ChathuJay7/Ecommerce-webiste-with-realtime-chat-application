import { FilterQuery } from "mongoose";

export interface IBaseRepository<T>{

    create(createEntityData: T | any): Promise<T>;

    findOne(entityFilterQuery: FilterQuery<T>): Promise<T>;

    findMany(entitiesFilterQuery: FilterQuery<T>): Promise<T[]>;

    findOneAndUpdate(entityFilterQuery: FilterQuery<T>, updateEntityData: Partial<T>): Promise<T>;
}

