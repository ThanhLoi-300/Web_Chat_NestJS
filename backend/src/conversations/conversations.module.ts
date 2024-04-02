import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { Services } from 'src/utils/constants';
import { ConversationsService } from './conversations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Message } from 'src/utils/typeorm';
import { UsersModule } from 'src/users/users.module';
import { isAuthorized } from 'src/utils/helpers';
import { ConversationMiddleware } from './middlewares/conversation.middleware';
import { JwtMiddleware } from 'src/auth/JwtMiddleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    UsersModule,
  ],
  controllers: [ConversationsController],
  providers: [
    {
      provide: Services.CONVERSATIONS,
      useClass: ConversationsService
    }
  ],
  exports: [
    {
      provide: Services.CONVERSATIONS,
      useClass: ConversationsService,
    },
  ],
})
export class ConversationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthorized, ConversationMiddleware)
      .forRoutes('conversations/:id');
  }
}
