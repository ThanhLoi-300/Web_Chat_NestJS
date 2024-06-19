import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IMessageService } from './message';
import { User } from 'src/utils/typeorm';
import { CreateMessageDto } from './dtos/CreateMessageDto';
import { AuthenticatedRequest } from 'src/utils/types';
import { IUserService } from 'src/users/interfaces/user';
import { SocketService } from 'src/utils/SocketService';
import { UpdateSeenMessageDto } from './dtos/UpdateSeenMessageDto';

@Controller(Routes.MESSAGES)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
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

    const socket = this.socketService.getSocket();
    socket.emit('message.create', response);
    return;
  }

  @Get()
  async getMessagesFromConversation(@Param('id') id: string) {
    const messages = await this.messageService.getMessages(id);
    return { _id: id, messages };
  }

  @Delete(':messageId')
  async deleteMessageFromConversation(
    @Req() req: AuthenticatedRequest,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
  ) {
    const params = { userId: req.userId, conversationId, messageId };
    const messageDeleted =
      await this.messageService.deleteMessage(params);
    return messageDeleted;
  }

  @Post('/updateSeenMessage')
  async updateSeenMessage(
    @Req() req: AuthenticatedRequest,
    @Body() params: UpdateSeenMessageDto,
  ) {
    await this.messageService.updateSeenMessage(req.userId, params.messageId);
  }
}
