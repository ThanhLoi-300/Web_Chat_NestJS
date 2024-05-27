import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { Services } from 'src/utils/constants';
import { ConversationsService } from './conversations.service';
import { Conversation, Message } from 'src/utils/typeorm';
import { UsersModule } from 'src/users/users.module';
import { isAuthorized } from 'src/utils/helpers';
import { ConversationMiddleware } from './middlewares/conversation.middleware';
import { ConversationSchema } from 'src/utils/typeorm/entities/Conversation';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/utils/typeorm/entities/Message';
import { SocketService } from 'src/utils/SocketService';
import { SearchConversation } from './searchConversation.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    UsersModule,
    FriendsModule,
    SearchConversation,
  ],
  controllers: [ConversationsController],
  providers: [
    {
      provide: Services.CONVERSATIONS,
      useClass: ConversationsService,
    },
    SocketService,
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
