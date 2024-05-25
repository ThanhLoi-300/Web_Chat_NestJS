import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IConversationsService } from './conversation';
import {
  AuthenticatedRequest,
  CreateConversationParams,
} from 'src/utils/types';
import { SocketService } from 'src/utils/SocketService';

@Controller(Routes.CONVERSATIONS)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
    private socketService: SocketService,
  ) {}

  @Post()
  async createConversation(
    @Req() req: AuthenticatedRequest,
    @Body() createConversationPayload: CreateConversationParams,
  ) {
    const { existed, conversation } =
      await this.conversationsService.createConversation(
        req.userId,
        createConversationPayload,
      );

    if (!existed) {
      const socket = this.socketService.getSocket();
      socket.emit('conversation.create', { idUser: req.userId, conversation });
    }

    return conversation;
  }

  @Get()
  async getConversations(@Req() req: AuthenticatedRequest) {
    return await this.conversationsService.getConversations(req.userId);
  }

  @Get(':id')
  async getConversationById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return await this.conversationsService.findById(id, req.userId);
  }
}
