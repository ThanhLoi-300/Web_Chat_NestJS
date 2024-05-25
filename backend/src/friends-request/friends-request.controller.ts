import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Routes, ServerEvents, Services } from '../utils/constants';
import { User } from '../utils/typeorm';
import { IFriendRequestService } from '../friends-request/friends-request';
import { AuthenticatedRequest } from 'src/utils/types';
import { IUserService } from 'src/users/interfaces/user';

@Controller(Routes.FRIEND_REQUESTS)
export class FriendRequestController {
  constructor(
    @Inject(Services.FRIENDS_REQUESTS_SERVICE)
    private readonly friendRequestService: IFriendRequestService,
    @Inject(Services.USERS) private readonly userService: IUserService,
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
    const user: User = await this.userService.findUser({ _id: req.userId });
    const params = { user, id };
    const friendRequest = await this.friendRequestService.create(params);
    return friendRequest;
  }

  @Patch(':id/accept')
  async acceptFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const response = await this.friendRequestService.accept({
      id,
      userId: req.userId,
    });
    return response;
  }

  @Delete(':id/cancel')
  async cancelFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const response = await this.friendRequestService.cancel({
      id,
      userId: req.userId,
    });
    return response;
  }

  @Patch(':id/reject')
  async rejectFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const response = await this.friendRequestService.reject({
      id,
      userId: req.userId,
    });
    return response;
  }
}