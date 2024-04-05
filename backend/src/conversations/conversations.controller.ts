import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IConversationsService } from './conversation';
import { CreateConversationDto } from './dtos/CreateConversation';
import { User } from 'src/utils/typeorm';
import { AuthenticatedRequest } from 'src/utils/types';
import { PusherHelper } from 'src/utils/PusherHelper';
import { IUserService } from 'src/users/interfaces/user';
import Pusher from 'pusher';

@Controller(Routes.CONVERSATIONS)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
    @Inject(PusherHelper) private pusherHelper: PusherHelper,
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  @Post()
  async createConversation(
    @Req() req: AuthenticatedRequest,
    @Body() createConversationPayload: CreateConversationDto,
  ) {
    console.log(createConversationPayload.id);
    const user: User = await this.userService.findUser({ id: req.userId });
    const conversation = await this.conversationsService.createConversation(
      user,
      createConversationPayload,
    );

    const pusher: Pusher = this.pusherHelper.getPusherInstance();
    pusher.trigger(
      conversation.recipient.id.toString(),
      'onConversation',
      conversation,
    );
    return conversation;
  }

  @Get()
  async getConversations(@Req() req: AuthenticatedRequest) {
    return this.conversationsService.getConversations(req.userId);
  }

  @Get(':id')
  async getConversationById(@Param('id') id: number) {
    return this.conversationsService.findById(id);
  }
}
