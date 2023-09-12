import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Message, MessageDocument } from "../schemas/message.schema";
import { Model } from "mongoose";
import { CreateMessageDto } from "../dto/create-message.dto";
import { BaseAbstractRepository } from "../../../core/repositories/base/base-abstract.repository";

@Injectable()
export class MessageRepository extends BaseAbstractRepository<MessageDocument>{

    constructor(
        @InjectModel(Message.name) 
        private messageModel: Model<MessageDocument>) {
        super(messageModel);
    }

    async createMessage(createMessageDto: CreateMessageDto){
       
        const createMessage = await this.messageModel.create(createMessageDto);
        if(!createMessage){
            throw new Error('Error creating message');
        }
        return createMessage;

    };

    

}