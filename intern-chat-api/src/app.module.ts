import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from './modules/message/message.module';
import { EventsModule } from './modules/event/event.module';
import { databaseConnection } from './core/config/configurations';

@Module({
  imports: [MongooseModule.forRoot(databaseConnection), MessageModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
