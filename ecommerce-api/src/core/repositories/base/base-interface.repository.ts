import { DeepPartial } from "typeorm";

export interface IBaseRepositoy<T>{

    // Finds all entity entries. (Updated options can be applied. sid50 feature)
    findAll(options?: any): Promise<T[]>;

    // Finds a single entity entry by a given id.
    findOne(options?: any): Promise<T>;

    findOneById(id: string): Promise<T>;

    // Creates a new Entry from the given entity object.
    create(entity: T): Promise<T>; 

    //Deletes a entity entry from the given Id.
    delete(id: string): Promise<void>;

    //Updates the entity. Entity can be found by a given conditions.
    updates(entityToUpdate: T):Promise<T>;
    filter(entityName?: string, filterDto?: { [key: string]: any }): Promise<T[]>;
    paginate(paginateDto?: { [key: string]: any }): Promise<T[]>;
    //filter(filterDto?: { [key: string]: any }, columnNames?: { [key: string]: string }): Promise<T[]>
}