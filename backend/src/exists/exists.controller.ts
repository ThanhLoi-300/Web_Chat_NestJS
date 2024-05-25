import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IConversationsService } from '../conversations/conversation';
import { IUserService } from '../users/interfaces/user';
import { Routes, Services } from '../utils/constants';
import { User } from '../utils/typeorm';
import { AuthenticatedRequest } from 'src/utils/types';

@Controller(Routes.EXISTS)
export class ExistsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {}

  @Get('conversations/:recipientId')
  async checkConversationExists(
    @Req() req: AuthenticatedRequest,
    @Param('recipientId') recipientId: string,
  ) {
    // const conversation = await this.conversationsService.isCreated(
    //   recipientId,
    //   user.id,
    // );
    // if (conversation) return conversation;
    // const recipient = await this.userService.findUser({ _id: recipientId });
    // if (!recipient)
    //   throw new HttpException('Recipient Not Found', HttpStatus.NOT_FOUND);
    // const newConversation = await this.conversationsService.createConversation(
    //   user,
    //   {
    //     id: recipient.id,
    //   },
    // );
    // return newConversation;
  }
}