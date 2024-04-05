import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Inject,
  Delete,
  Req,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Routes, Services } from '../../utils/constants';
import { IGroupRecipientService } from '../interfaces/group-recipents';
import { PusherHelper } from 'src/utils/PusherHelper';
import Pusher from 'pusher';
import { AuthenticatedRequest } from 'src/utils/types';

@Controller(Routes.GROUP_RECIPIENTS)
export class GroupRecipientsController {
  constructor(
    @Inject(Services.GROUP_RECIPIENTS)
    private readonly groupRecipientService: IGroupRecipientService,
    @Inject(PusherHelper) private pusherHelper: PusherHelper,
  ) {}

  @Post()
  async addGroupRecipient(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const params = { id, userId: req.userId };
    const response = await this.groupRecipientService.addGroupRecipient(params);

    const pusher: Pusher = this.pusherHelper.getPusherInstance();
    pusher.trigger(id.toString(), 'group.user.add', response);//recipentId
    return response;
  }

  @Delete('leave')
  async leaveGroup(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) groupId: number,
  ) {
    const group = await this.groupRecipientService.leaveGroup({
      id: groupId,
      userId: req.userId,
    });

    const pusher: Pusher = this.pusherHelper.getPusherInstance();
    pusher.trigger(groupId.toString(), 'group.user.leave', {
      group,
      userId: req.userId,
    }); 
    return group;
  }

  @Delete(':userId')
  async removeGroupRecipient(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) removeUserId: number,
  ) {
    const params = { issuerId: req.userId, id, removeUserId };
    const response = await this.groupRecipientService.removeGroupRecipient(params);

    const pusher: Pusher = this.pusherHelper.getPusherInstance();
    pusher.trigger(id.toString(), 'group.user.remove', response);
    return response.group;
  }
}