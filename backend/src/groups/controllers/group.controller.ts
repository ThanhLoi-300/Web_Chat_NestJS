import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Routes, Services } from '../../utils/constants';
import { User } from '../../utils/typeorm';
import { AuthenticatedRequest } from '../../utils/types';
import { CreateGroupDto } from '../dtos/CreateGroupDto';
import { TransferOwnerDto } from '../dtos/TransferOwnerDto';
import { UpdateGroupDetailsDto } from '../dtos/UpdateGroupDetailsDto';
import { IGroupService } from '../interfaces/group';
import { IUserService } from 'src/users/interfaces/user';
import { PusherHelper } from 'src/utils/PusherHelper';
import Pusher from 'pusher';

@SkipThrottle()
@Controller(Routes.GROUPS)
export class GroupController {
  constructor(
    @Inject(Services.GROUPS) private readonly groupService: IGroupService,
    @Inject(Services.USERS) private readonly userService: IUserService,
    @Inject(PusherHelper) private pusherHelper: PusherHelper,
  ) {}

  @Post()
  async createGroup(
    @Req() req: AuthenticatedRequest,
    @Body() payload: CreateGroupDto,
  ) {
    const user: User = await this.userService.findUser({ id: req.userId });
    const group = await this.groupService.createGroup({
      ...payload,
      creator: user,
    });

    const pusher: Pusher = this.pusherHelper.getPusherInstance();
    pusher.trigger('group', 'group.create', group);
    return group;
  }

  @Get()
  getGroups(@Req() req: AuthenticatedRequest) {
    return this.groupService.getGroups({ userId: req.userId });
  }

  @Get(':id')
  getGroup(@Req() req: AuthenticatedRequest, @Param('id') id: number) {
    return this.groupService.findGroupById(id);
  }

  @Patch(':id/owner')
  async updateGroupOwner(
    @Req() req: AuthenticatedRequest,
    @Param('id') groupId: number,
    @Body() { newOwnerId }: TransferOwnerDto,
  ) {
    const params = { userId: req.userId, groupId, newOwnerId };
    const group = await this.groupService.transferGroupOwner(params);

    const pusher: Pusher = this.pusherHelper.getPusherInstance();
    pusher.trigger('group', 'group.owner.update', group);
    return group;
  }

  @Patch(':id/details')
  async updateGroupDetails(
    @Body() { title, avatar }: UpdateGroupDetailsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    console.log(title);
    return this.groupService.updateDetails({ id, avatar, title });
  }
}
