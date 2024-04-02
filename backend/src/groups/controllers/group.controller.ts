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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';
import { Routes, Services } from '../../utils/constants';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm';
import { AuthenticatedRequest } from '../../utils/types';
import { CreateGroupDto } from '../dtos/CreateGroupDto';
import { TransferOwnerDto } from '../dtos/TransferOwnerDto';
import { UpdateGroupDetailsDto } from '../dtos/UpdateGroupDetailsDto';
import { IGroupService } from '../interfaces/group';
import { IUserService } from 'src/users/interfaces/user';

@SkipThrottle()
@Controller(Routes.GROUPS)
export class GroupController {
  constructor(
    @Inject(Services.GROUPS) private readonly groupService: IGroupService,
    @Inject(Services.USERS) private readonly userService: IUserService,
    private eventEmitter: EventEmitter2,
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
    this.eventEmitter.emit('group.create', group);
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
    @AuthUser() { id: userId }: User,
    @Param('id') groupId: number,
    @Body() { newOwnerId }: TransferOwnerDto,
  ) {
    const params = { userId, groupId, newOwnerId };
    const group = await this.groupService.transferGroupOwner(params);
    this.eventEmitter.emit('group.owner.update', group);
    return group;
  }

  @Patch(':id/details')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateGroupDetails(
    @Body() { title }: UpdateGroupDetailsDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    console.log(title);
    // return this.groupService.updateDetails({ id, avatar, title });
  }
}
