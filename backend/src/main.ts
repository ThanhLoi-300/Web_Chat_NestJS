import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'reflect-metadata';
import { AppModule } from './app.module';

let envFilePath = '.env.development';
if (process.env.ENVIRONMENT === 'PRODUCTION') envFilePath = '.env.production';

async function bootstrap() {
  const {PORT, COOKIE_SECRET} = process.env
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api')
  app.enableCors({origin: 'http://localhost:5173', credentials: true})
  app.useGlobalPipes(new ValidationPipe())

  try {
    await app.listen(PORT, ()=> console.log(`Running on port ${PORT}`))
  } catch (err) {
    console.log(err)
  }
}
bootstrap();
