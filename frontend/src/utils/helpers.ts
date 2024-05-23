import {
  ArrowCycle,
  ChatDots,
  Crown,
  Minus,
  Person,
  PersonCross,
  Gear,
} from 'akar-icons';
import {
  IoIosPerson,
  IoIosNotifications,
  IoIosLock,
  IoMdInfinite,
  IoMdColorPalette,
  IoMdVideocam,
} from 'react-icons/io';
import {
  Conversation,
  Friend,
  FriendRequest,
  FriendRequestDetailsType,
  Group,
  SettingsSidebarRouteType,
  User,
  UserContextMenuActionType,
  UserSidebarRouteType,
} from './types';

export const getRecipientFromConversation = (
  conversation?: Conversation,
  user?: User
) => {
  return user?._id !== conversation?.member[0]._id
    ? conversation?.member[0]
    : conversation?.member[1];
};

export const getUserContextMenuIcon = (type: UserContextMenuActionType) => {
  switch (type) {
    case 'kick':
      return { icon: PersonCross, color: '#ff0000' };
    case 'transfer_owner':
      return { icon: Crown, color: '#FFB800' };
    default:
      return { icon: Minus, color: '#7c7c7c' };
  }
};

export const isGroupOwner = (user?: User, group?: Conversation) =>
  user?._id === group?.owner!._id;

export const getUserSidebarIcon = (id: UserSidebarRouteType) => {
  switch (id) {
    case 'conversations':
      return ChatDots;
    case 'friends':
      return Person;
    case 'connections':
      return ArrowCycle;
    case 'settings':
      return Gear;
    case 'calls':
      return IoMdVideocam;
    default:
      return ChatDots;
  }
};

export const getSettingSidebarIcon = (id: SettingsSidebarRouteType) => {
  switch (id) {
    case 'profile':
      return IoIosPerson;
    case 'security':
      return IoIosLock;
    case 'notifications':
      return IoIosNotifications;
    case 'integrations':
      return IoMdInfinite;
    case 'appearance':
      return IoMdColorPalette;
  }
};

export const getFriendRequestDetails = (
  { receiver, sender }: FriendRequest,
  user?: User
): FriendRequestDetailsType =>
  user?._id === receiver._id
    ? {
        status: 'Incoming Friend Request',
        displayName: sender.name,
        user: sender,
        incoming: true,
      }
    : {
        status: 'Outgoing Friend Request',
        displayName: receiver.name,
        user: receiver,
        incoming: false,
      };

export const getUserFriendInstance = (
  authenticatedUser: User,
  selectedFriend: Friend
) =>
  authenticatedUser?._id === selectedFriend?.sender._id
    ? selectedFriend?.receiver
    : selectedFriend?.sender;