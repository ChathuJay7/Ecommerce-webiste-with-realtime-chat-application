import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport/dist';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

import { LocalStrategy } from './strategies/local.strategy';
import getConfig from '../../core/config/configurations'
import { EMailModule } from 'src/modules/email/email.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    EMailModule,
    JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async () => ({
      secret: getConfig().JWT.secret,
    }),
    inject: [ConfigService],
  })
],
  providers: [AuthService,JwtStrategy,LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
