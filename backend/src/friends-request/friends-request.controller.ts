import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Routes, ServerEvents, Services } from '../utils/constants';
import { User } from '../utils/typeorm';
import { IFriendRequestService } from '../friends-request/friends-request';
import { AuthenticatedRequest } from 'src/utils/types';
import { IUserService } from 'src/users/interfaces/user';
import { PusherHelper } from 'src/utils/PusherHelper';
import Pusher from 'pusher';

@Controller(Routes.FRIEND_REQUESTS)
export class FriendRequestController {
  constructor(
    @Inject(Services.FRIENDS_REQUESTS_SERVICE)
    private readonly friendRequestService: IFriendRequestService,
    private event: EventEmitter2,
    @Inject(Services.USERS) private readonly userService: IUserService,
    @Inject(PusherHelper) private pusherHelper: PusherHelper,
  ) {}

  @Get()
  getFriendRequests(@Req() req: AuthenticatedRequest) {
    return this.friendRequestService.getFriendRequests(req.userId);
  }

  @Post()
  async createFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Body('id') id: string,
  ) {
    const user: User = await this.userService.findUser({ id: req.userId });
    const params = { user, id: parseInt(id) };
    const friendRequest = await this.friendRequestService.create(params);

    const pusher: Pusher = this.pusherHelper.getPusherInstance();
    pusher.trigger(
      req.userId.toString(),
      'friendrequest.create',
      friendRequest,
    );
    return friendRequest;
  }

  @Patch(':id/accept')
  async acceptFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.friendRequestService.accept({
      id,
      userId: req.userId,
    });
    this.event.emit(ServerEvents.FRIEND_REQUEST_ACCEPTED, response);
    return response;
  }

  @Delete(':id/cancel')
  async cancelFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.friendRequestService.cancel({
      id,
      userId: req.userId,
    });
    this.event.emit('friendrequest.cancel', response);
    return response;
  }

  @Patch(':id/reject')
  async rejectFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.friendRequestService.reject({
      id,
      userId: req.userId,
    });
    this.event.emit(ServerEvents.FRIEND_REQUEST_REJECTED, response);
    return response;
  }
}