import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserRepositoryInterface } from './interface/user-repository.interface';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';



@Module({
  imports: [TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
      name: 'USER_SERVICE',
      transport: Transport.RMQ,
      options: {
          urls: ['amqps://okeoojbo:GHhbX_6zxEMBmChND-aRLPoqNhUbJUf6@puffin.rmq2.cloudamqp.com/okeoojbo'],
          queue: 'main_queue',
          queueOptions: {
          durable: false
          },
      },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: `${UserRepositoryInterface}`,
      useClass: UserRepository
    },
  ],
  exports: [
    UserService,
    {
      provide: `${UserRepositoryInterface}`,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
