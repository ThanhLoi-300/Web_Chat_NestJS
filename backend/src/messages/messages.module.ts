import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Message } from 'src/utils/typeorm';
import { ConversationsModule } from 'src/conversations/conversations.module';
// import { FriendsModule } from 'src/friends/friends.module';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSchema } from 'src/utils/typeorm/entities/Conversation';
import { MessageSchema } from 'src/utils/typeorm/entities/Message';
import { SocketService } from 'src/utils/SocketService';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    ConversationsModule,
    // FriendsModule,
    UsersModule,
  ],
  controllers: [MessageController],
  providers: [
    {
      provide: Services.MESSAGES,
      useClass: MessageService,
    },
    SocketService,
  ],
  exports: [
    {
      provide: Services.MESSAGES,
      useClass: MessageService,
    },
  ],
})
export class MessagesModule {}
