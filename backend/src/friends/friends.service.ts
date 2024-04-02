import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from '../utils/typeorm';
import { DeleteFriendRequestParams } from '../utils/types';
import { IFriendsService } from './friends';

@Injectable()
export class FriendsService implements IFriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
  ) {}

  getFriends(id: number): Promise<Friend[]> {
    return this.friendsRepository.find({
      where: [{ sender: { id } }, { receiver: { id } }],
      relations: [
        'sender',
        'receiver',
        'sender.profile',
        'receiver.profile',
        //'receiver.presence',
        //'sender.presence',
      ],
    });
  }

  findFriendById(id: number): Promise<Friend> {
    return this.friendsRepository.findOne(id, {
      relations: [
        'sender',
        'receiver',
        'sender.profile',
        // 'sender.presence',
        'receiver.profile',
        // 'receiver.presence',
      ],
    });
  }

  async deleteFriend({ id, userId }: DeleteFriendRequestParams) {
    const friend = await this.findFriendById(id);
    if (!friend) throw new HttpException('Friend Not Found', HttpStatus.NOT_FOUND);
    console.log(friend);
    if (friend.receiver.id !== userId && friend.sender.id !== userId)
      throw new HttpException('Cannot Delete Friend', HttpStatus.BAD_REQUEST);
    await this.friendsRepository.delete(id);
    return friend;
  }

  isFriends(userOneId: number, userTwoId: number) {
    return this.friendsRepository.findOne({
      where: [
        {
          sender: { id: userOneId },
          receiver: { id: userTwoId },
        },
        {
          sender: { id: userTwoId },
          receiver: { id: userOneId },
        },
      ],
    });
  }
}