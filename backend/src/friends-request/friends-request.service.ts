import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFriendsService } from '../friends/friends';
import { IUserService } from '../users/interfaces/user';
import { Services } from '../utils/constants';
import { FriendRequest } from '../utils/typeorm';
import { Friend } from '../utils/typeorm/entities/Friend';
import {
  CancelFriendRequestParams,
  CreateFriendParams,
  FriendRequestParams,
} from '../utils/types';
import { IFriendRequestService } from './friends-request';

@Injectable()
export class FriendRequestService implements IFriendRequestService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
    @Inject(Services.FRIENDS_SERVICE)
    private readonly friendsService: IFriendsService,
  ) {}

  getFriendRequests(id: number): Promise<FriendRequest[]> {
    const status = 'pending';
    return this.friendRequestRepository.find({
      where: [
        { sender: { id }, status },
        { receiver: { id }, status },
      ],
      relations: ['receiver', 'sender', 'receiver.profile', 'sender.profile'],
    });
  }

  async cancel({ id, userId }: CancelFriendRequestParams) {
    const friendRequest = await this.findById(id);
    if (!friendRequest) throw new HttpException('Friend Request not found', HttpStatus.BAD_REQUEST);
    if (friendRequest.sender.id !== userId) throw new HttpException('Friend Request Exception',HttpStatus.BAD_REQUEST);
    await this.friendRequestRepository.delete(id);
    return friendRequest;
  }

  async create({ user: sender, name }: CreateFriendParams) {
    const receiver = await this.userService.findUser({ name });
    if (!receiver) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const exists = await this.isPending(sender.id, receiver.id);
    if (exists) throw new HttpException('Friend Requesting Pending', HttpStatus.BAD_REQUEST);
    if (receiver.id === sender.id)
      throw new HttpException('Friend Request Exception: Cannot Add Yourself',HttpStatus.BAD_REQUEST);
    const isFriends = await this.friendsService.isFriends(
      sender.id,
      receiver.id,
    );
    if (isFriends) throw new HttpException('Friend Already Exists', HttpStatus.CONFLICT);
    const friend = this.friendRequestRepository.create({
      sender,
      receiver,
      status: 'pending',
    });
    return this.friendRequestRepository.save(friend);
  }

  async accept({ id, userId }: FriendRequestParams) {
    const friendRequest = await this.findById(id);
    if (!friendRequest) throw new HttpException('Friend Request not found', HttpStatus.BAD_REQUEST);
    if (friendRequest.status === 'accepted')
      throw new HttpException('Friend Request Already Accepted', HttpStatus.BAD_REQUEST);
    if (friendRequest.receiver.id !== userId)
      throw new HttpException('Friend Request Exception',HttpStatus.BAD_REQUEST)
    friendRequest.status = 'accepted';
    const updatedFriendRequest = await this.friendRequestRepository.save(
      friendRequest,
    );
    const newFriend = this.friendRepository.create({
      sender: friendRequest.sender,
      receiver: friendRequest.receiver,
    });
    const friend = await this.friendRepository.save(newFriend);
    return { friend, friendRequest: updatedFriendRequest };
  }

  async reject({ id, userId }: CancelFriendRequestParams) {
    const friendRequest = await this.findById(id);
    if (!friendRequest) throw new HttpException('Friend Request not found', HttpStatus.BAD_REQUEST);
    if (friendRequest.status === 'accepted')
      throw new HttpException('Friend Request Already Accepted', HttpStatus.BAD_REQUEST);
    if (friendRequest.receiver.id !== userId)
      throw new HttpException('Friend Request Exception',HttpStatus.BAD_REQUEST);;
    friendRequest.status = 'rejected';
    return this.friendRequestRepository.save(friendRequest);
  }

  isPending(userOneId: number, userTwoId: number) {
    return this.friendRequestRepository.findOne({
      where: [
        {
          sender: { id: userOneId },
          receiver: { id: userTwoId },
          status: 'pending',
        },
        {
          sender: { id: userTwoId },
          receiver: { id: userOneId },
          status: 'pending',
        },
      ],
    });
  }

  findById(id: number): Promise<FriendRequest> {
    return this.friendRequestRepository.findOne(id, {
      relations: ['receiver', 'sender'],
    });
  }
}