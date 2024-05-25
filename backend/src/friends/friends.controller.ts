import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Routes, ServerEvents, Services } from '../utils/constants';
import { IFriendsService } from './friends';
import { AuthenticatedRequest } from 'src/utils/types';

@Controller(Routes.FRIENDS)
export class FriendsController {
  constructor(
    // @Inject(Services.FRIENDS_SERVICE)
    // private readonly friendsService: IFriendsService,
  ) {}

  // @Get()
  // getFriends(@Req() req: AuthenticatedRequest) {
  //   console.log('Fetching Friends');
  //   return this.friendsService.getFriends(req.userId);
  // }

  // @Delete(':id/delete')
  // async deleteFriend(
  //   @Req() req: AuthenticatedRequest,
  //   @Param('id') id: string,
  // ) {
  //   const friend = await this.friendsService.deleteFriend({
  //     id,
  //     userId: req.userId,
  //   });
  //   // this.event.emit(ServerEvents.FRIEND_REMOVED, { friend, userId });
  //   return friend;
  // }
}