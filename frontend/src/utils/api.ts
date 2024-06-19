import axios from "axios";
import {
  AcceptFriendRequestResponse,
  CancelFriendRequestResponse,
  AddGroupRecipientParams,
  Conversation,
  CreateGroupParams,
  CreateUserParams,
  DeleteMessageParams,
  DeleteMessageResponse,
  EditMessagePayload,
  FetchMessagePayload,
  Friend,
  FriendRequest,
  MessageType,
  RemoveGroupRecipientParams,
  UpdateGroupDetailsPayload,
  UpdateGroupOwnerParams,
  UpdateStatusParams,
  User,
  UserCredentialsParams,
  CreateMessageParams,
} from "./types";

const API_URL = "https://web-chat-nestjs-1.onrender.com/api";
// const API_URL = "http://localhost:3001/api";
const token = localStorage.getItem("accessToken");

let config = {
  headers: {
    authorization: `Bearer ${token}`,
  },
};

export const updateToken = () => {
  const jwt = window.localStorage.getItem("accessToken");
  if (jwt) {
    config.headers.authorization = `Bearer ${jwt}`;
  }
};

const axiosClient = axios.create({ baseURL: API_URL });

export const postRegisterUser = async (data: CreateUserParams) =>
  axiosClient.post("/auth/register", data);

export const postLoginUser = (data: UserCredentialsParams) =>
  axiosClient.post(`/auth/login`, data);

export const logoutUser = () => axiosClient.post("/auth/logout", config);

export const getUser = () => axiosClient.get<User>(`/users`, config);

export const searchUsers = (query: string) =>
  axiosClient.get<User[]>(`/users/search?query=${query}`, config);

export const searchConversations = (query: string) =>
  axiosClient.get<Conversation[]>(`/searchConversation?query=${query}`, config);

export const getConversations = () =>
  axiosClient.get<Conversation[]>(`/conversations`, config);

export const getConversationById = (id: string) =>
  axiosClient.get<Conversation>(`/conversations/${id}`, config);

export const getConversationMessages = (conversationId: string) =>
  axiosClient.get<FetchMessagePayload>(
    `/conversations/${conversationId}/messages`,
    config
  );

export const fetchMessage = () =>
  axiosClient.get<FetchMessagePayload[]>(`/fetchMessage`, config);

export const createMessage = (id: string, data: CreateMessageParams) => {
  return axiosClient.post(`/conversations/${id}/messages`, data, config);
};

export const postNewConversation = (data: Conversation) =>
  axiosClient.post<Conversation>(`/conversations`, data, config);

export const deleteMessage = ({ id, messageId }: DeleteMessageParams) =>
  axiosClient.delete<DeleteMessageResponse>(
    `/conversations/${id}/messages/${messageId}`,
    config
  );

export const editMessage = ({ content, id, messageId }: EditMessagePayload) =>
  axiosClient.patch<MessageType>(
    `/conversations/${id}/messages/${messageId}`,
    { content },
    config
  );

export const fetchGroups = () =>
  axiosClient.get<Conversation[]>(`/groups`, config);

export const createGroup = (params: CreateGroupParams) =>
  axiosClient.post(`/groups`, params, config);

export const removeGroupRecipient = ({
  id,
  userId,
}: RemoveGroupRecipientParams) =>
  axiosClient.post<Conversation>(
    `/searchConversation/deleteMember`,
    { id, userId },
    config
  );

export const updateGroupOwner = ({ id, newOwnerId }: UpdateGroupOwnerParams) =>
  axiosClient.post(
    `/searchConversation/updateGroupOwner`,
    { id, userId: newOwnerId },
    config
  );

export const leaveGroup = (id: string) =>
  axiosClient.get(`/conversations/${id}/leaveGroup`, config);

export const updateGroupDetails = (data: UpdateGroupDetailsPayload) =>
  axiosClient.post<Conversation>(
    `/conversations/${data._id}/updateGroup`,
    data,
    config
  );

export const addGroupRecipient = ({
  id,
  recipentIds,
}: AddGroupRecipientParams) =>
  axiosClient.post(
    `/conversations/${id}/addMemberToConversation`,
    { recipentIds },
    config
  );

export const searchFriends = (query: string) =>
  axiosClient.get<User[]>(`/friends/searchFriends?query=${query}`, config);

export const updateStatusMessage = (data: UpdateStatusParams) =>
  axiosClient.patch("/users/presence/status", data, config);

export const fetchFriends = () => axiosClient.get<User[]>("/friends", config);

export const fetchFriendRequests = () =>
  axiosClient.get<FriendRequest[]>("/friends/requests", config);

export const createFriendRequest = (id: string) =>
  axiosClient.post<FriendRequest[]>("/friends/requests", { id }, config);

export const cancelFriendRequest = (id: string) =>
  axiosClient.delete<CancelFriendRequestResponse>(
    `/friends/requests/${id}/cancel`,
    config
  );

export const acceptFriendRequest = (id: string) =>
  axiosClient.patch<AcceptFriendRequestResponse>(
    `/friends/requests/${id}/accept`,
    config
  );

export const rejectFriendRequest = (id: string) =>
  axiosClient.patch<CancelFriendRequestResponse>(
    `/friends/requests/${id}/reject`,
    config
  );

export const removeFriend = (id: string) =>
  axiosClient.delete<Friend>(`/friends/${id}/delete`, config);

export const checkConversationOrCreate = (recipientId: string) =>
  axiosClient.get<Conversation>(
    `/searchConversation/${recipientId}/exists`,
    config
  );

export const updateUserProfile = (
  banner: string,
  avatar: string,
  name: string
) =>
  axiosClient.patch<User>("/users/profiles", { banner, avatar, name }, config);

export const updateSeenMessage = (messageId: string, conversationId: string) =>
  axiosClient.post<any>(
    "/conversations/" + conversationId + "/messages/updateSeenMessage",
    { messageId },
    config
  );

export const completeUserProfile = (data: FormData) =>
  axiosClient.post("/users/profiles", data);
