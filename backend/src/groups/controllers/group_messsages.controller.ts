import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Req,
} from '@nestjs/common';
import { CreateMessageDto } from '../../messages/dtos/CreateMessageDto';
import { EditMessageDto } from '../../messages/dtos/EditMessageDto';
import { Routes, Services } from '../../utils/constants';
import { AuthenticatedRequest } from '../../utils/types';
import { IGroupMessageService } from '../interfaces/group-messages';
import { PusherHelper } from 'src/utils/PusherHelper';
import Pusher from 'pusher';
import { IUserService } from 'src/users/interfaces/user';

@Controller(Routes.GROUP_MESSAGES)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGES)
    private readonly groupMessageService: IGroupMessageService,
    @Inject(PusherHelper) private pusherHelper: PusherHelper,
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  @Post()
  async createGroupMessage(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() { content, attachments }: CreateMessageDto,
  ) {
    console.log(`Creating Group Message for ${id}`);

    const user = await this.userService.findUser({ id: req.userId });
    const params = { groupId: id, author: user, content, attachments };
    const response = await this.groupMessageService.createGroupMessage(params);

    const pusher: Pusher = this.pusherHelper.getPusherInstance();
    pusher.trigger(id.toString(), 'createGroupMessage', response);

    return;
  }

  @Get()
  async getGroupMessages(@Param('id', ParseIntPipe) id: number) {
    console.log(`Fetching GroupMessages for Group Id: ${id}`);
    const messages = await this.groupMessageService.getGroupMessages(id);
    return { id, messages };
  }

  @Delete(':messageId')
  async deleteGroupMessage(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) groupId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    const user = await this.userService.findUser({ id: req.userId });
    await this.groupMessageService.deleteGroupMessage({
      userId: user.id,
      groupId,
      messageId,
    });

    const pusher: Pusher = this.pusherHelper.getPusherInstance();
    pusher.trigger(groupId.toString(), 'group.message.delete', {
      userId: user.id,
      messageId,
      groupId,
    });

    return { groupId, messageId };
  }

  @Patch(':messageId')
  async editGroupMessage(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) groupId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() { content }: EditMessageDto,
  ) {
    const params = { userId: req.userId as number, content, groupId, messageId };
    const message = await this.groupMessageService.editGroupMessage(params);

    const pusher: Pusher = this.pusherHelper.getPusherInstance();
    pusher.trigger(groupId.toString(), 'group.message.update', message);
    return message;
  }
}
