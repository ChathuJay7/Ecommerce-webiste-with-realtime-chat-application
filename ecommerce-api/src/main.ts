import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import getConfig from './core/config/configurations';
import rawBodyMiddleware from './core/middleware/raw-body.middleware';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(rawBodyMiddleware());
  app.use(cors()); // Enable CORS for all routes
  app.setGlobalPrefix(
    `${getConfig().APP.globalPrefix}/${getConfig().APP.version}`,
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(getConfig().APP.name)
    .setDescription(getConfig().APP.description)
    .setVersion(getConfig().APP.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    `${getConfig().APP.globalPrefix}/${getConfig().APP.version}`,
    app,
    document,
  );
  await app.listen(getConfig().APP.port);
}
bootstrap();
