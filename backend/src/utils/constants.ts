export enum Routes {
  AUTH = 'auth',
  USERS = 'users',
  CONVERSATIONS = 'conversations',
  MESSAGES = 'conversations/:id/messages',
  GROUP_RECIPIENTS = 'groups/:id/recipients',
  EXISTS = 'exists',
  FRIENDS = 'friends',
  FRIEND_REQUESTS = 'friends/requests',
  USER_PRESENCE = 'users/presence',
  SEARCHCONVERSATION = 'searchConversation',
}

export enum Services {
  AUTH = 'AUTH_SERVICE',
  USERS = 'USERS_SERVICE',
  USER_PRESENCE = 'USER_PRESENCE_SERVICE',
  CONVERSATIONS = 'CONVERSATIONS_SERVICE',
  MESSAGES = 'MESSAGE_SERVICE',
  GATEWAY_SESSION_MANAGER = 'GATEWAY_SESSION_MANAGER',
  FRIENDS_SERVICE = 'FRIENDS_SERVICE',
  FRIENDS_REQUESTS_SERVICE = 'FRIEND_REQUEST_SERVICE',
  SPACES_CLIENT = 'SPACES_CLIENT',
  IMAGE_UPLOAD_SERVICE = 'IMAGE_UPLOAD_SERVICE',
  SEARCHCONVERSATION = 'SEARCHCONVERSATION',
}

export enum ServerEvents {
  FRIEND_REQUEST_ACCEPTED = 'friendrequest.accepted',
  FRIEND_REQUEST_REJECTED = 'friendrequest.rejected',
  FRIEND_REQUEST_CANCELLED = 'friendrequest.cancelled',
  FRIEND_REMOVED = 'friend.removed',
}

export enum WebsocketEvents {
  FRIEND_REQUEST_ACCEPTED = 'onFriendRequestAccepted',
  FRIEND_REQUEST_REJECTED = 'onFriendRequestRejected',
  VIDEO_CALL_REJECTED = 'onVideoCallRejected',
  VOICE_CALL_ACCEPTED = 'onVoiceCallAccepted',
  VOICE_CALL_HANG_UP = 'onVoiceCallHangUp',
  VOICE_CALL_REJECTED = 'onVoiceCallRejected',
}