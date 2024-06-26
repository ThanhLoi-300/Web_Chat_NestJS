import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFriendsService } from '../friends/friends';
import { IUserService } from '../users/interfaces/user';
import { Services } from '../utils/constants';
import { FriendRequest, User } from '../utils/typeorm';
import { Friend } from '../utils/typeorm/entities/Friend';
import {
  AcceptFriendRequestResponse,
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
    // @Inject(Services.FRIENDS_SERVICE)
    // private readonly friendsService: IFriendsService,
  ) {}
  accept(params: FriendRequestParams): Promise<AcceptFriendRequestResponse> {
    throw new Error('Method not implemented.');
  }

  getFriendRequests(id: string): Promise<FriendRequest[]> {
    const status = 'pending';
    return this.friendRequestRepository.find({
      where: [
        { sender: id, status },
        { receiver: id, status },
      ],
      relations: ['receiver', 'sender', 'receiver.profile', 'sender.profile'],
    });
  }

  async cancel({ id, userId }: CancelFriendRequestParams) {
    const friendRequest = await this.findById(id);
    if (!friendRequest)
      throw new HttpException(
        'Friend Request not found',
        HttpStatus.BAD_REQUEST,
      );
    if (friendRequest.sender !== userId)
      throw new HttpException(
        'Friend Request Exception',
        HttpStatus.BAD_REQUEST,
      );
    await this.friendRequestRepository.delete(id);
    return friendRequest;
  }

  async create({ user: sender, id }: CreateFriendParams) {
    const receiver = await this.userService.findUser({ _id: id });
    console.log(JSON.stringify(receiver));
    if (!receiver)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const exists = await this.isPending(sender.id, receiver.id);
    if (exists)
      throw new HttpException(
        'Friend Requesting Pending',
        HttpStatus.BAD_REQUEST,
      );
    if (receiver.id === sender.id)
      throw new HttpException(
        'Friend Request Exception: Cannot Add Yourself',
        HttpStatus.BAD_REQUEST,
      );
    // const isFriends = await this.friendsService.isFriends(
    //   sender.id,
    //   receiver.id,
    // );
    // if (isFriends)
    //   throw new HttpException('Friend Already Exists', HttpStatus.CONFLICT);
    // const friend = this.friendRequestRepository.create({
    //   sender,
    //   receiver,
    //   status: 'pending',
    // });
    // return this.friendRequestRepository.save(friend);
  }

  // async accept({ id, userId }: FriendRequestParams) {
  //   const friendRequest = await this.findById(id);
  //   if (!friendRequest)
  //     throw new HttpException(
  //       'Friend Request not found',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   if (friendRequest.status === 'accepted')
  //     throw new HttpException(
  //       'Friend Request Already Accepted',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   if (friendRequest.receiver !== userId)
  //     throw new HttpException(
  //       'Friend Request Exception',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   friendRequest.status = 'accepted';
  //   const updatedFriendRequest =
  //     await this.friendRequestRepository.save(friendRequest);
  //   const newFriend = this.friendRepository.create({
  //     sender: friendRequest.sender,
  //     receiver: friendRequest.receiver,
  //   });
  //   const friend = await this.friendRepository.save(newFriend);
  //   return { friend, friendRequest: updatedFriendRequest };
  // }

  async reject({ id, userId }: CancelFriendRequestParams) {
    const friendRequest = await this.findById(id);
    if (!friendRequest)
      throw new HttpException(
        'Friend Request not found',
        HttpStatus.BAD_REQUEST,
      );
    if (friendRequest.status === 'accepted')
      throw new HttpException(
        'Friend Request Already Accepted',
        HttpStatus.BAD_REQUEST,
      );
    if (friendRequest.receiver !== userId)
      throw new HttpException(
        'Friend Request Exception',
        HttpStatus.BAD_REQUEST,
      );
    friendRequest.status = 'rejected';
    return this.friendRequestRepository.save(friendRequest);
  }

  isPending(userOneId: string, userTwoId: string) {
    return this.friendRequestRepository.findOne({
      where: [
        {
          sender:userOneId,
          receiver: userTwoId,
          status: 'pending',
        },
        {
          sender: userTwoId ,
          receiver: userOneId,
          status: 'pending',
        },
      ],
    });
  }

  findById(id: string): Promise<FriendRequest> {
    // return this.friendRequestRepository.findOne(id, {
    //   relations: ['receiver', 'sender'],
    // });
    return null
  }
}