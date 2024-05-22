import { Types } from 'mongoose';
import {
  Conversation,
  Friend,
  FriendRequest,
  Group,
  GroupMessage,
  Message,
  User,
} from './typeorm';
import { Request } from 'express';

export type CreateUserDetails = {
  name: string;
  password: string;
  email: string
};

export type ValidateUserDetails = {
  email: string;
  password: string;
};

export type FindUserParams = {
  _id?: string;
  email?: string;
  name?: string;
};

export type FindUserOptions = Partial<{
  selectAll: boolean;
}>;

export type CreateConversationParams = {
  _id?: string;
  type: string;
  nameGroup?: string;
  imgGroup?: string;
  member: User[];
  lastMessage?: string;
};

export type ConversationIdentityType = 'author' | 'recipient';

export type FindParticipantParams = Partial<{
  id: string;
}>;

export interface AuthenticatedRequest extends Request {
  user: User;
  userId: string;
}

export type CreateParticipantParams = {
  id: string;
};

export type CreateMessageParams = {
  id: string;
  content?: string;
  attachments?: string[];
  user: User;
};

export type CreateMessageResponse = {
  message: Message;
  conversation: Conversation;
};

export type DeleteMessageParams = {
  userId: string;
  conversationId: string;
  messageId: string;
  img: string
};

export type FindMessageParams = {
  userId: string;
  conversationId: string;
  messageId: string;
};

export type EditMessageParams = {
  conversationId: string;
  messageId: string;
  userId: string;
  content: string;
};

export type EditGroupMessageParams = {
  groupId: string;
  messageId: string;
  userId: string;
  content: string;
};

export type CreateGroupParams = {
  creator: User;
  title?: string;
  users: string[];
};

export type FetchGroupsParams = {
  userId: string;
};

export type CreateGroupMessageParams = {
  author: User;
  attachments?: string[];
  content: string;
  groupId: string;
};

export type CreateGroupMessageResponse = {
  message: GroupMessage;
  group: Group;
};

export type DeleteGroupMessageParams = {
  userId: string;
  groupId: string;
  messageId: string;
};

export type AddGroupRecipientParams = {
  id: string;
  userId: string;
};

export type RemoveGroupRecipientParams = {
  id: string;
  removeUserId: string;
  issuerId: string;
};

export type AddGroupUserResponse = {
  group: Group;
  user: User;
};

export type RemoveGroupUserResponse = {
  group: Group;
  user: User;
};

export type AccessParams = {
  id: string;
  userId: string;
};

export type TransferOwnerParams = {
  userId: string;
  groupId: string;
  newOwnerId: string;
};

export type LeaveGroupParams = {
  id: string;
  userId: string;
};

export type CheckUserGroupParams = {
  id: string;
  userId: string;
};

export type CreateFriendParams = {
  user: User;
  id: string;
};

export type FriendRequestStatus = 'accepted' | 'pending' | 'rejected';

export type FriendRequestParams = {
  id: string;
  userId: string;
};

export type CancelFriendRequestParams = {
  id: string;
  userId: string;
};

export type DeleteFriendRequestParams = {
  id: string;
  userId: string;
};

export type AcceptFriendRequestResponse = {
  friend: Friend;
  friendRequest: FriendRequest;
};

export type RemoveFriendEventPayload = {
  //friend: Friend;
  userId: number;
};

export type GetConversationMessagesParams = {
  id: string;
  limit: number;
};

export type UpdateConversationParams = Partial<{
  id: string;
  lastMessage: string;
}>;

export type UpdateStatusMessageParams = {
  user: User;
  statusMessage: string;
};

export type CallHangUpPayload = {
  receiver: User;
  caller: User;
};

export type VoiceCallPayload = {
  conversationId: string;
  recipientId: string;
};

export type CallAcceptedPayload = {
  caller: User;
};

export type UpdateGroupDetailsParams = {
  id: number;
  title?: string;
  avatar?: string;
};


export type UserParams = {
  id?: string;
  email?: string;
  password?: string;
  name?: string;
  banner?: string;
  avatar?: string;
};

export type deleteMessageResponse = {
  conversation: Conversation;
  messageDelete: Message;
};