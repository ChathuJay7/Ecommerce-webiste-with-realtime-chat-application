import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenv.config();


export const getDatabaseConfigurations: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: true,
};

export default () => ({
  APP: {
    name: process.env.NAME,
    description: process.env.DESCRIPTION,
    globalPrefix: process.env.GLOBAL_PREFIX,
    version: process.env.API_VERSION,
    port: parseInt(process.env.PORT) || 3000,
    clientUrl: process.env.CLIENT_URL,
  },

  DATABASE: getDatabaseConfigurations,

  JWT: {
    secret: process.env.JWT_SECRET,
  },

  MAIL_SERVICE: {
    transporter: {
      host: process.env.SENDGRID_HOST,
      port: parseInt(process.env.SENDGRID_PORT),
      secure: false,
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS,
      },
    },
    fromMail: process.env.SENDGRID_EMAIL,
  },

  BCRYPT: {
    passwordSalt: parseInt(process.env.PW_SALT),
  },

  STRIPE: {
    secretKey: process.env.STRIPE_SECRET,
    paymentMode: process.env.PAYMENT_MODE,
    webhookSecret: process.env.WEBHOOK_SECRET,
    apiVersion: process.env.API_VERSION,
  },

});
