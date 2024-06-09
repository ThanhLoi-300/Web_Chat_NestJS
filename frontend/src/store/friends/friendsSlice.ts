import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FriendRequest, Points, User } from '../../utils/types';
import {
  acceptFriendRequestThunk,
  cancelFriendRequestThunk,
  createFriendRequestThunk,
  fetchFriendRequestThunk,
  fetchFriendsThunk,
  rejectFriendRequestThunk,
  removeFriendThunk,
} from './friendsThunk';

export interface FriendsState {
  friends: User[];
  friendRequests: FriendRequest[];
  showContextMenu: boolean;
  selectedFriendContextMenu?: User;
  points: Points;
}

const initialState: FriendsState = {
  friends: [],
  friendRequests: [],
  showContextMenu: false,
  points: { x: 0, y: 0 },
};

export const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    addFriendRequest: (state, action: PayloadAction<FriendRequest>) => {
      state.friendRequests.push(action.payload);
    },
    removeFriendRequest: (state, action: PayloadAction<FriendRequest>) => {
      const { sender } = action.payload;
      state.friendRequests = state.friendRequests.filter(
        (friendRequest) => friendRequest.sender._id !== sender._id
      );
    },
    removeFriend: (state, action: PayloadAction<User>) => {
      console.log("removeFriend reducer" + JSON.stringify(action.payload));
      console.log("removeFriend reducer1" + JSON.stringify(state.friends));
      state.friends = state.friends.filter(
        (friend) => friend._id !== action.payload._id
      );
      console.log("removeFriend reducer2" + JSON.stringify(state.friends));
    },
    toggleContextMenu: (state, action: PayloadAction<boolean>) => {
      state.showContextMenu = action.payload;
    },
    setSelectedFriend: (state, action: PayloadAction<User>) => {
      state.selectedFriendContextMenu = action.payload;
    },
    setContextMenuLocation: (state, action: PayloadAction<Points>) => {
      state.points = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchFriendsThunk.fulfilled, (state, action) => {
        console.log(
          "fetchFriendsThunk.fulfilled " + JSON.stringify(action.payload.data)
        );
        state.friends = action.payload.data;
      })
      .addCase(fetchFriendRequestThunk.fulfilled, (state, action) => {
        console.log('fetchFriendRequestsThunk.fulfilled');
        state.friendRequests = action.payload.data;
      })
      .addCase(createFriendRequestThunk.fulfilled, (state, action) => {
        console.log('createFriendRequestThunk.fulfilled');
        state.friendRequests = action.payload.data;
      })
      .addCase(createFriendRequestThunk.rejected, (state, action) => {
        console.log(state, action);
      })
      .addCase(cancelFriendRequestThunk.fulfilled, (state, action) => {
        const { _id } = action.payload.data;
        state.friendRequests = state.friendRequests.filter(
          (friendRequest) => friendRequest._id !== _id
        );
      })
      .addCase(acceptFriendRequestThunk.fulfilled, (state, action) => {
        console.log('acceptFriendRequestThunk.fulfilled');
        const {
          friendRequest: { _id },
        } = action.payload.data;
        state.friendRequests = state.friendRequests.filter(
          (friendRequest) => friendRequest._id !== _id
        );
      })
      .addCase(rejectFriendRequestThunk.fulfilled, (state, action) => {
        console.log('rejectFriendRequestThunk.fulfilled');
        const { _id } = action.payload.data;
        state.friendRequests = state.friendRequests.filter(
          (friendRequest) => friendRequest._id !== _id
        );
      })
      .addCase(removeFriendThunk.fulfilled, (state, action) => {
        console.log('rejectFriendRequestThunk.fulfilled');
        state.friends = state.friends.filter(
          (friend) => friend._id !== action.payload.data._id
        );
      }),
});

export const {
  addFriendRequest,
  removeFriendRequest,
  toggleContextMenu,
  setContextMenuLocation,
  setSelectedFriend,
  removeFriend,
} = friendsSlice.actions;
export default friendsSlice.reducer;