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
import { AddMember } from './dtos/AddMember';
import { UpdateGroup } from './dtos/UpdateGroup';

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

  @Post('/:id/addMemberToConversation')
  async addMemberToConversation(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() params: AddMember,
  ) {
    await this.conversationsService.addMemberToConversation(
      id,
      params.recipentIds,
    );

    return await this.conversationsService.findById(id, req.userId);
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

  @Get(':id/leaveGroup')
  async leaveGroup(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.conversationsService.leaveGroup(id, req.userId);
  }

  @Post(':id/updateGroup')
  async updateGroup(
    @Req() req: AuthenticatedRequest,
    @Body() params: UpdateGroup,
  ) {
    return await this.conversationsService.updateGroup(params);;
  }
}
