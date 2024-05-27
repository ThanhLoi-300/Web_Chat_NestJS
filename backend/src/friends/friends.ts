import { Friend, FriendRequest, User } from '../utils/typeorm';
import { AcceptFriendRequestResponse, CancelFriendRequestParams, CreateFriendParams, DeleteFriendRequestParams, FriendRequestParams } from '../utils/types';

export interface IFriendsService {
  getFriends(id: string): Promise<User[]>;
  findFriendById(id: string): Promise<Friend>;
  deleteFriend(params: DeleteFriendRequestParams);
  // isFriends(userOneId: string, userTwoId: string): Promise<Friend | undefined>;
  accept(params: FriendRequestParams): Promise<AcceptFriendRequestResponse>;
  cancel(params: CancelFriendRequestParams);
  create(params: CreateFriendParams);
  reject(params: CancelFriendRequestParams);
  getFriendRequests(userId: string): Promise<FriendRequest[]>;
  isPending(userOneId: string, userTwoId: string);
  // findById(id: string): Promise<FriendRequest>;
}