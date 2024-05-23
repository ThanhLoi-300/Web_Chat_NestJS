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
  _id: string;
  email: string;
  name: string;
  avatar: string;
  banner: string;
  // profile?: Profile;
  // presence?: UserPresence;
  // peer: UserPeer;
};

export type Conversation = {
  _id?: string;
  type: string;
  nameGroup?: string;
  imgGroup?: string;
  member: User[];
  lastMessageId?: Message;
  owner?: User;
};

export type Message = {
  _id?: string;
  content?: string;
  conversationId?: string;
  senderId?: User;
  img?: string[];
};

export type CreateConversationParams = {
  id: string;
};

export type MessageAttachment = {
  key: string;
};

export type MessageType = {
  _id: string;
  content?: string;
  createdAt: string;
  senderId: User;
  conversation: Conversation;
  seen: User[],
  img: string[],
  isdeleted: boolean,
};

export type GroupMessageType = {
  id: string;
  content?: string;
  createdAt: string;
  author: User;
  group: Group;
  attachments?: string[];
};

export type FetchMessagePayload = {
  _id: string;
  messages: MessageType[];
};

export type FetchGroupMessagePayload = {
  id: string;
  messages: MessageType[];
};

export type MessageEventPayload = {
  message: MessageType;
  conversation: Conversation;
};

export type CreateMessageParams = {
  id: string;
  content: string;
  attachments?: string[];
  user: User;
};

export type ConversationMessage = {
  _id: string;
  messages: MessageType[];
};

export type GroupMessage = {
  id: number;
  messages: GroupMessageType[];
};

export type DeleteMessageParams = {
  id: string;
  messageId: string;
};

export type DeleteGroupMessageParams = {
  id: string;
  messageId: string;
};

export type DeleteMessageResponse = {
  conversationId: string;
  messageId: string;
};

export type DeleteGroupMessageResponse = {
  groupId: string;
  messageId: string;
};

export type MessagePanelBodyProps = {
  isTyping: boolean;
};

export type EditMessagePayload = {
  id: string;
  messageId: string;
  content: string;
};

export type ConversationType = 'group' | 'private';

export type ConversationTypeData = {
  type: ConversationType;
  label: string;
};

export type Group = {
  id: string;
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
  message: MessageType;
  group: Conversation;
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
  id: string ;
  userId: string;
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
  id: string;
  newOwnerId: string;
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
  id: string;
  data: FormData;
};

export enum UpdateGroupAction {
  NEW_MESSAGE = 'newMessage',
}

export type UpdateGroupPayload = {
  type?: UpdateGroupAction;
  group: Conversation;
};

export type GroupParticipantLeftPayload = {
  group: Group;
  userId: string;
};