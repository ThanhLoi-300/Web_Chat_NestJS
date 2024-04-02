import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Services } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Message } from 'src/utils/typeorm';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    ConversationsModule,
    FriendsModule,
  ],
  controllers: [MessageController],
  providers: [{
    provide: Services.MESSAGES,
    useClass: MessageService
  }],
  exports: [{
    provide: Services.MESSAGES,
    useClass: MessageService
  }]
})
export class MessagesModule {}