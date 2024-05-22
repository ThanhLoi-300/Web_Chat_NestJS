import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './utils/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtMiddleware } from './auth/JwtMiddleware';
import { JwtModule } from '@nestjs/jwt';
import { GatewayModule } from './gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { SocketService } from './utils/SocketService';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sa:123@cluster0.pw5n1yo.mongodb.net/',
    ),
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'helloworld',
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    UsersModule,
    ConversationsModule,
    MessagesModule,
    GatewayModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [
    JwtModule,
    SocketService,
  ],
  exports: [JwtModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
