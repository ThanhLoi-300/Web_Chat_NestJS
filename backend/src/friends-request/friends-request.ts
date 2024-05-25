import { FriendRequest } from '../utils/typeorm';
import {
  AcceptFriendRequestResponse,
  CancelFriendRequestParams,
  CreateFriendParams,
  FriendRequestParams,
} from '../utils/types';

export interface IFriendRequestService {
  accept(params: FriendRequestParams): Promise<AcceptFriendRequestResponse>;
  cancel(params: CancelFriendRequestParams): Promise<FriendRequest>;
  create(params: CreateFriendParams);
  reject(params: CancelFriendRequestParams): Promise<FriendRequest>;
  getFriendRequests(userId: string): Promise<FriendRequest[]>;
  isPending(userOneId: string, userTwoId: string);
  findById(id: string): Promise<FriendRequest>;
}