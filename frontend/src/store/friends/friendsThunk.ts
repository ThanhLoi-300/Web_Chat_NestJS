import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchFriendRequests as fetchFriendRequestsAPI,
  fetchFriends as fetchFriendsAPI,
  createFriendRequest as createFriendRequestAPI,
  cancelFriendRequest as cancelFriendRequestAPI,
  acceptFriendRequest as acceptFriendRequestAPI,
  rejectFriendRequest as rejectFriendRequestAPI,
  removeFriend as removeFriendAPI,
} from '../../utils/api';

export const fetchFriendsThunk = createAsyncThunk('friends/fetch', () =>
  fetchFriendsAPI()
);

export const fetchFriendRequestThunk = createAsyncThunk(
  'friends/requests/fetch',
  () => fetchFriendRequestsAPI()
);

export const createFriendRequestThunk = createAsyncThunk(
  'friends/requests/create',
  (id: string) => createFriendRequestAPI(id)
);

export const cancelFriendRequestThunk = createAsyncThunk(
  'friends/request/cancel',
  (id: string) => cancelFriendRequestAPI(id)
);

export const acceptFriendRequestThunk = createAsyncThunk(
  'friends/request/accept',
  (id: string) => acceptFriendRequestAPI(id)
);

export const rejectFriendRequestThunk = createAsyncThunk(
  'friends/request/reject',
  (id: string) => rejectFriendRequestAPI(id)
);

export const removeFriendThunk = createAsyncThunk(
  'friends/remove',
  (id: string) => removeFriendAPI(id)
);