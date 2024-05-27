import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Friend, FriendRequest, User } from '../utils/typeorm';
import {
  AcceptFriendRequestResponse,
  CancelFriendRequestParams,
  CreateFriendParams,
  DeleteFriendRequestParams,
  FriendRequestParams,
  FriendResponse,
} from '../utils/types';
import { IFriendsService } from './friends';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUserService } from 'src/users/interfaces/user';
import { Services } from 'src/utils/constants';

@Injectable()
export class FriendsService implements IFriendsService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequest>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {}

  async getFriends(id: string): Promise<User[]> {
    const friends = await this.friendModel
      .findOne({ user: id })
      .populate('user')
      .populate('listFriend')
    return friends ? friends.listFriend.map((f) => f as unknown as User) : [];
  }

  findFriendById(id: string): Promise<Friend> {
    return this.friendModel.findById(id);
  }

  async deleteFriend({ id: friendId, userId }: DeleteFriendRequestParams) {
    const friend = await this.friendModel.findOneAndUpdate(
      { user: userId },
      { $pull: { listFriend: friendId } },
      { new: true },
    );
    return friend;
  }

  async getFriendRequests(id: string): Promise<FriendRequest[]> {
    const status = 'pending';
    const friendRequests = await this.friendRequestModel
      .find({
        $or: [
          {
            sender: id,
          },
          {
            receiver: id,
          },
        ],
        status,
      })
      .populate('sender')
      .populate('receiver')
      .sort({ createdAt: -1 });
    return friendRequests;
  }

  async cancel({ id, userId }: CancelFriendRequestParams) {
    const friendRequestDeleted = await this.friendRequestModel.findByIdAndDelete(id);
    return { _id: friendRequestDeleted._id};
  }

  async create({ user: sender, id }: CreateFriendParams) {
    const receiver = await this.userService.findUser({ _id: id });
    if (!receiver)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const exists = await this.isPending(sender._id, receiver._id);
    if (exists)
      throw new HttpException(
        'Friend Requesting Pending',
        HttpStatus.BAD_REQUEST,
      );
    const isFriends = await this.isFriends(sender._id, receiver._id);
    if (isFriends)
      throw new HttpException('Friend Already Exists', HttpStatus.CONFLICT);
    const friend = new this.friendRequestModel({
      sender: sender._id,
      receiver: receiver._id,
      status: 'pending',
    });
    await friend.save();
  }

  async accept({ id, userId }: FriendRequestParams) {
    const friendRequest = await this.friendRequestModel.findById(id);
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
    friendRequest.status = 'accepted';
    await friendRequest.save();
    await this.addFriend(userId, friendRequest.sender);
    await this.addFriend(friendRequest.sender, userId);

    const friendOfUser = (await this.friendModel.findOne({user: userId}).populate('user')).populated('listFriend')

    return { friend: friendOfUser!, friendRequest: friendRequest };
  }

  async addFriend(userId: string, friendId: string) {
    const friendOfUser = await this.friendModel.findOne({ user: userId });

    let newFriend;
    if (!friendOfUser) {
      const f = new this.friendModel({
        user: userId,
        listFriend: [friendId],
      });
      const saved = await f.save();
      newFriend = await this.friendModel.findById(saved._id);
    } else {
      if (friendOfUser.listFriend.includes(friendId)) return;
      friendOfUser.listFriend.push(friendId);
      const saved = await friendOfUser.save();
      newFriend = await this.friendModel.findById(saved._id);
    }
    await newFriend.save()
  }

  async reject({ id, userId }: CancelFriendRequestParams) {
    const friendRequest = await this.friendRequestModel.findById(id);
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
    return friendRequest.save();
  }

  async isPending(userOneId: string, userTwoId: string): Promise<boolean> {
    const pendingRequest = await this.friendRequestModel.findOne({
      $or: [
        {
          sender: userOneId,
          receiver: userTwoId,
          status: 'pending',
        },
        {
          sender: userTwoId,
          receiver: userOneId,
          status: 'pending',
        },
      ],
    });

    return !!pendingRequest;
  }

  async isFriends(userOneId: string, userTwoId: string): Promise<boolean> {
    const pendingRequest = await this.friendRequestModel.findOne({
      $or: [
        {
          sender: userOneId,
          receiver: userTwoId,
          status: 'accepted',
        },
        {
          sender: userTwoId,
          receiver: userOneId,
          status: 'accepted',
        },
      ],
    });

    return !!pendingRequest;
  }
}
