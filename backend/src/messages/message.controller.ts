import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IMessageService } from './message';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { CreateMessageDto } from './dtos/CreateMessageDto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EditMessageDto } from './dtos/EditMessageDto';
// import { PusherHelper } from 'src/utils/PusherHelper';
import { AuthenticatedRequest } from 'src/utils/types';
import { IUserService } from 'src/users/interfaces/user';
import { Types } from 'mongoose';
import { SocketService } from 'src/utils/SocketService';
// import Pusher from 'pusher';

@Controller(Routes.MESSAGES)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
    private eventEmitter: EventEmitter2,
    // @Inject(PusherHelper) private pusherHelper: PusherHelper,
    @Inject(Services.USERS) private readonly userService: IUserService,
    private socketService: SocketService,
  ) {}

  @Post() async createMessage(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() { content, attachments }: CreateMessageDto,
  ) {
    const user: User = await this.userService.findUser({ _id: req.userId });
    const params = { user, id, content, attachments };
    const response = await this.messageService.createMessage(params);

    // const pusher: Pusher = this.pusherHelper.getPusherInstance();
    // pusher.trigger(req.userId.toString(), 'onMessage', response);
    // pusher.trigger(
    //   response.conversation.recipient.id.toString(),
    //   'onMessage',
    //   response,
    // );
    const socket = this.socketService.getSocket();
    socket.emit('message.create', response);
    return;
  }

  @Get()
  async getMessagesFromConversation(@Param('id') id: string) {
    const messages = await this.messageService.getMessages(id);
    return { _id: id, messages };
  }

  @Get('/typingText')
  async typingText(
    @Param('id') id: string,
    @Query('typingStatus') typingStatus: string,
  ) {
    const isTyping = typingStatus === 'true';
    // const pusher: Pusher = this.pusherHelper.getPusherInstance();
    // if (isTyping) {
    //   pusher.trigger(id.toString(), 'onTypingStart', typingStatus);
    //   console.log(`onTypingStart: ${id} - ` + typingStatus);
    // } else {
    //   pusher.trigger(id.toString(), 'onTypingStop', typingStatus);
    //   console.log(`onTypingStop: ${id} - ` + typingStatus);
    // }
  }

  @Delete(':messageId')
  async deleteMessageFromConversation(
    @Req() req: AuthenticatedRequest,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
    @Param('img') img: string,
  ) {
    const params = { userId: req.userId, conversationId, messageId, img };
    const { conversation, messageDelete } =
      await this.messageService.deleteMessage(params);
    
    const socket = this.socketService.getSocket();
    socket.emit('onMessageDelete', params);
    return { conversation, messageDelete };
  }

  // @Patch(':messageId')
  // async editMessage(
  //   @Req() req: AuthenticatedRequest,
  //   @Param('id') conversationId: string,
  //   @Param('messageId') messageId: string,
  //   @Body() { content }: EditMessageDto,
  // ) {
  //   const params = { userId: req.userId, content, conversationId, messageId };
  //   const message = await this.messageService.editMessage(params);

  //   // const pusher: Pusher = this.pusherHelper.getPusherInstance();
  //   // pusher.trigger(conversationId.toString(), 'message.update', message);
  //   return message;
  // }
}
