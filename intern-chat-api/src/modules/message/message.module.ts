import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './repository/message.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name:Message.name, schema:MessageSchema }])],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository]
})
export class MessageModule {}
