import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MessageDocument = Message & Document;

@Schema()
export class Message{

    @Prop()
    id: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    authorId: string;

    @Prop()
    readList: string[];

    @Prop()
    createdAt: Date;

}

export const MessageSchema = SchemaFactory.createForClass(Message);