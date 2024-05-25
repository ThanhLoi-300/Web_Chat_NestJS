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
}
