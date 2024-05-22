import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

let envFilePath = '.env.development';
if (process.env.ENVIRONMENT === 'PRODUCTION') envFilePath = '.env.production';

async function bootstrap() {
  const { PORT } = process.env;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*', credentials: true });

  app.useWebSocketAdapter(new IoAdapter(app));

  try {
    await app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
