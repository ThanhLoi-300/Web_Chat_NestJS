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
import { DeleteMember } from './dtos/DeleteMember';
import { AuthenticatedRequest } from 'src/utils/types';

@Controller(Routes.SEARCHCONVERSATION)
export class SearchConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
  ) {}

  @Get()
  async searchConversation(@Query('query') query: string) {
    return await this.conversationsService.searchConversation(query);
  }

  @Post('deleteMember')
  async deleteMember(@Body() deleteMemberPayload: DeleteMember) {
    const { id, userId } = deleteMemberPayload;
    console.log(id, userId);
    await this.conversationsService.deleteMember(id, userId);
  }

  @Post('updateGroupOwner')
  async updateGroupOwner(@Body() deleteMemberPayload: DeleteMember) {
    const { id, userId } = deleteMemberPayload;
    console.log(userId);
    await this.conversationsService.updateGroupOwner(id, userId);
  }

  @Get(':id/exists')
  async checkConversationExists(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    console.log('zo');
    return await this.conversationsService.checkConversationExists(
      id,
      req.userId,
    );
  }
}
