import { Document, FilterQuery, Model } from "mongoose";
import { IBaseRepository } from "./base-interface.repository";

export abstract class BaseAbstractRepository<T extends Document> implements IBaseRepository<T> {

    constructor(private entityModel: Model<T>){}


    async create(createEntityData: any): Promise<T> {
        const newData = new this.entityModel(createEntityData);
        return await newData.save();
    }

    async findOne(entityFilterQuery: FilterQuery<T>): Promise<T>{
        return await this.entityModel.findOne(entityFilterQuery);
    }

    async findMany(entitiesFilterQuery: FilterQuery<T>): Promise<T[]>{
        return await this.entityModel.find(entitiesFilterQuery);
    }

    async findOneAndUpdate(entityFilterQuery: FilterQuery<T>, updateEntityData: Partial<T>): Promise<T>{
        return await this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData);
    }
}