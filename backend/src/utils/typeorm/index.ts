import { User } from './entities/User';
import { Conversation } from './entities/Conversation';
import { Message } from './entities/Message';
import { Friend } from './entities/Friend';
import { FriendRequest } from './entities/FriendRequest';

const entities = [
  User,
  Conversation,
  Message,
  Friend,
  FriendRequest,
];
export {
  User,
  Conversation,
  Message,
  Friend,
  FriendRequest,
};

export default entities;
