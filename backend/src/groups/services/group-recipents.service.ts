import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from '../../users/interfaces/user';
import { Services } from '../../utils/constants';
import { Group } from '../../utils/typeorm';
import {
  AddGroupRecipientParams,
  CheckUserGroupParams,
  LeaveGroupParams,
  RemoveGroupRecipientParams,
} from '../../utils/types';
import { IGroupService } from '../interfaces/group';
import { IGroupRecipientService } from '../interfaces/group-recipents';

@Injectable()
export class GroupRecipientService implements IGroupRecipientService {
  constructor(
    @Inject(Services.USERS) private userService: IUserService,
    @Inject(Services.GROUPS) private groupService: IGroupService,
  ) {}

  async addGroupRecipient(params: AddGroupRecipientParams) {
    const group = await this.groupService.findGroupById(params.id);
    if (!group) throw new HttpException('Group Not Found', HttpStatus.NOT_FOUND);
    if (group.owner.id !== params.userId)
      throw new HttpException('Insufficient Permissions', HttpStatus.FORBIDDEN);
    const recipient = await this.userService.findUser({
      id: params.id,
    });
    if (!recipient)
      throw new HttpException('Cannot Add User', HttpStatus.BAD_REQUEST);
    const inGroup = group.users.find((user) => user.id === recipient.id);
    if (inGroup)
      throw new HttpException('User already in group', HttpStatus.BAD_REQUEST);
    group.users = [...group.users, recipient];
    const savedGroup = await this.groupService.saveGroup(group);
    return { group: savedGroup, user: recipient };
  }

  async removeGroupRecipient(params: RemoveGroupRecipientParams) {
    const { issuerId, removeUserId, id } = params;
    const userToBeRemoved = await this.userService.findUser({
      id: removeUserId,
    });
    if (!userToBeRemoved)
      throw new HttpException('User cannot be removed', HttpStatus.BAD_REQUEST);
    const group = await this.groupService.findGroupById(id);
    if (!group) throw new HttpException('Group Not Found', HttpStatus.NOT_FOUND);
    // Not group owner
    if (group.owner.id !== issuerId) throw new HttpException('Group Owner Transfer Exception',HttpStatus.BAD_REQUEST);
    // Temporary
    if (group.owner.id === removeUserId)
      throw new HttpException(
        'Cannot remove yourself as owner',
        HttpStatus.BAD_REQUEST,
      );
    group.users = group.users.filter((u) => u.id !== removeUserId);
    const savedGroup = await this.groupService.saveGroup(group);
    return { group: savedGroup, user: userToBeRemoved };
  }

  async isUserInGroup({ id, userId }: CheckUserGroupParams) {
    const group = await this.groupService.findGroupById(id);
    if (!group) throw new HttpException('Group Not Found', HttpStatus.NOT_FOUND);
    const user = group.users.find((user) => user.id === userId);
    if (!user) throw new HttpException('Group Participant Not Found', HttpStatus.NOT_FOUND);
    return group;
  }

  async leaveGroup({ id, userId }: LeaveGroupParams) {
    const group = await this.isUserInGroup({ id, userId });
    console.log(`Updating Groups`);
    if (group.owner.id === userId)
      throw new HttpException(
        'Cannot leave group as owner',
        HttpStatus.BAD_REQUEST,
      );
    console.log('New Users in Group after leaving...');
    console.log(group.users.filter((user) => user.id !== userId));
    group.users = group.users.filter((user) => user.id !== userId);
    return this.groupService.saveGroup(group);
  }
}