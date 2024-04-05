export type CreateUserParams = {
  name: string;
  password: string;
  email: string;
};

export type UserCredentialsParams = {
  email: string;
  password: string;
};

export type Profile = {
  id: number;
  about?: string;
  avatar?: string;
  banner?: string;
};

export type UserPresence = {
  id: number;
  statusMessage?: string;
  showOffline: boolean;
};

export type UserPeer = {
  id: string;
};

export type User = {
  id: number;
  email: string;
  name: string;
  profile?: Profile;
  presence?: UserPresence;
  peer: UserPeer;
};

export type Conversation = {
  id: number;
  creator: User;
  recipient: User;
  createdAt: string;
  lastMessageSent: MessageType;
};

export type CreateConversationParams = {
  id: number;
};

export type MessageAttachment = {
  key: string;
};

export type MessageType = {
  id: number;
  content?: string;
  createdAt: string;
  author: User;
  conversation: Conversation;
  attachments?: string[];
};

export type GroupMessageType = {
  id: number;
  content?: string;
  createdAt: string;
  author: User;
  group: Group;
  attachments?: string[];
};

export type FetchMessagePayload = {
  id: number;
  messages: MessageType[];
};

export type FetchGroupMessagePayload = {
  id: number;
  messages: GroupMessageType[];
};

export type MessageEventPayload = {
  message: MessageType;
  conversation: Conversation;
};

export type CreateMessageParams = {
  id: number;
  content: string;
};

export type CreateMessageParams1 = {
  id: number;
  content: string;
  attachments?: string[];
};

export type ConversationMessage = {
  id: number;
  messages: MessageType[];
};

export type GroupMessage = {
  id: number;
  messages: GroupMessageType[];
};

export type DeleteMessageParams = {
  id: number;
  messageId: number;
};

export type DeleteGroupMessageParams = {
  id: number;
  messageId: number;
};

export type DeleteMessageResponse = {
  conversationId: number;
  messageId: number;
};

export type DeleteGroupMessageResponse = {
  groupId: number;
  messageId: number;
};

export type MessagePanelBodyProps = {
  isTyping: boolean;
};

export type EditMessagePayload = {
  id: number;
  messageId: number;
  content: string;
};

export type ConversationType = 'group' | 'private';

export type ConversationTypeData = {
  type: ConversationType;
  label: string;
};

export type Group = {
  id: number;
  title?: string;
  users: User[];
  creator: User;
  owner: User;
  messages: GroupMessageType[];
  createdAt: number;
  lastMessageSent: MessageType;
  lastMessageSentAt: Date;
  avatar?: string;
};

export type GroupMessageEventPayload = {
  message: GroupMessageType;
  group: Group;
};

export type CreateGroupParams = {
  users: number[];
  title: string;
  creator: User
};

export type AddGroupRecipientParams = {
  id: number;
  recipentId: number;
};

export type RemoveGroupRecipientParams = {
  id: number;
  userId: number;
};

export type Points = {
  x: number;
  y: number;
};

export type UserContextMenuActionType = 'kick' | 'transfer_owner' | 'profile';
export type ContextMenuItemType = {
  label: string;
  action: UserContextMenuActionType;
  color: string;
  ownerOnly: boolean;
};

export type AddGroupUserMessagePayload = {
  group: Group;
  user: User;
};

export type RemoveGroupUserMessagePayload = {
  group: Group;
  user: User;
};

export type UpdateGroupOwnerParams = {
  id: number;
  newOwnerId: number;
};

export type ContextMenuEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
export type DivMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type DragEvent = React.DragEvent<HTMLTextAreaElement>;
export type ClipboardEvent = React.ClipboardEvent<HTMLTextAreaElement>;
export type FormEvent = React.FormEvent<HTMLFormElement>;

export type FriendRequestStatus = 'accepted' | 'pending' | 'rejected';

export type Friend = {
  id: number;
  sender: User;
  receiver: User;
  createdAt: number;
};

export type FriendRequest = {
  id: number;
  sender: User;
  receiver: User;
  createdAt: number;
  status: FriendRequestStatus;
};

export type HandleFriendRequestAction = 'accept' | 'reject' | 'cancel';

export type CancelFriendRequestResponse = {
  id: number;
};

export type AcceptFriendRequestResponse = {
  friend: Friend;
  friendRequest: FriendRequest;
};

export type UserSidebarRouteType =
  | 'conversations'
  | 'friends'
  | 'connections'
  | 'settings'
  | 'calls';

export type UserSidebarItemType = {
  id: UserSidebarRouteType;
  pathname: string;
};

export type SettingsSidebarRouteType =
  | 'profile'
  | 'security'
  | 'notifications'
  | 'integrations'
  | 'appearance';

export type SettingsItemType = {
  id: SettingsSidebarRouteType;
  label: string;
  pathname: string;
};

export type RateLimitType = 'group' | 'private';

export type UpdateRateLimitPayload = {
  type: RateLimitType;
  status: boolean;
};

export type UpdateProfileParams = Partial<{
  about: string;
  avatar: File;
  banner: File;
}>;

export type Attachment = {
  id: number;
  file: File;
};

export type FriendRequestDetailsType = {
  status: string;
  displayName: string;
  user: User;
  incoming: boolean;
};

export type SystemMessageLevel = 'info' | 'warning' | 'error';
export type SystemMessageType = {
  id: number;
  content: string;
  level: SystemMessageLevel;
};

export type UpdateStatusParams = {
  statusMessage: string;
};

export type SelectableTheme = 'dark' | 'light';

export type CallPayload = {
  recipientId: number;
  conversationId: number;
  caller: User;
};

export type HandleCallType = 'accept' | 'reject';

export type AcceptedCallPayload = {
  acceptor: User;
  caller: User;
  conversation: Conversation;
};

export type SetVideoRefPayload = {
  localVideoRef?: React.RefObject<HTMLVideoElement>;
  remoteVideoRef?: React.RefObject<HTMLVideoElement>;
};

export type CallInitiatePayload = {
  localStream: MediaStream;
  isCalling: boolean;
  activeConversationId: number;
  caller: User;
  receiver: User;
  callType: CallType;
};

export type CallType = 'video' | 'audio';

export type UpdateGroupDetailsPayload = {
  id: number;
  data: FormData;
};

export enum UpdateGroupAction {
  NEW_MESSAGE = 'newMessage',
}

export type UpdateGroupPayload = {
  type?: UpdateGroupAction;
  group: Group;
};

export type GroupParticipantLeftPayload = {
  group: Group;
  userId: number;
};