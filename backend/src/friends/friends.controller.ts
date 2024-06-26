import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Routes, ServerEvents, Services } from '../utils/constants';
import { IFriendsService } from './friends';
import { AuthenticatedRequest } from 'src/utils/types';
import { User } from 'src/utils/typeorm';
import { IUserService } from 'src/users/interfaces/user';
import { SocketService } from 'src/utils/SocketService';

@Controller(Routes.FRIENDS)
export class FriendsController {
  constructor(
    @Inject(Services.FRIENDS_SERVICE)
    private readonly friendsService: IFriendsService,
    @Inject(Services.USERS) private readonly userService: IUserService,
    private socketService: SocketService,
  ) {}

  @Get()
  async getFriends(@Req() req: AuthenticatedRequest) {
    const listFriends = await this.friendsService.getFriends(req.userId);
    return listFriends;
  }

  @Get('searchFriends')
  async searchFriends(
    @Req() req: AuthenticatedRequest,
    @Query('query') query: string,
  ) {
    const listFriends = await this.friendsService.searchFriends(
      req.userId,
      query,
    );
    console.log(listFriends)
    return listFriends;
  }

  @Delete(':id/delete')
  async deleteFriend(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const friend = await this.friendsService.deleteFriend({
      id,
      userId: req.userId,
    });
    return friend;
  }

  @Get('requests')
  async getFriendRequests(@Req() req: AuthenticatedRequest) {
    return await this.friendsService.getFriendRequests(req.userId);
  }

  @Post('requests')
  async createFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Body('id') id: string,
  ) {
    const user: User = await this.userService.findUser({ _id: req.userId });
    const params = { user, id };
    await this.friendsService.create(params);
    return await this.friendsService.getFriendRequests(req.userId);
  }

  @Patch('requests/:id/accept')
  async acceptFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const response = await this.friendsService.accept({
      id,
      userId: req.userId,
    });
    return response;
  }

  @Delete('requests/:id/cancel')
  async cancelFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const response = await this.friendsService.cancel({
      id,
      userId: req.userId,
    });
    return response;
  }

  @Patch('requests/:id/reject')
  async rejectFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const response = await this.friendsService.reject({
      id,
      userId: req.userId,
    });
    return response;
  }
}