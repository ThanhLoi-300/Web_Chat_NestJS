import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Conversation } from "../utils/types";
import { getConversations, postNewConversation } from "../utils/api";
import { RootState } from ".";

export interface ConversationsState {
  conversations: Conversation[];
  loading: boolean;
}

const initialState: ConversationsState = {
  conversations: [],
  loading: false,
};

export const fetchConversationsThunk = createAsyncThunk(
  "conversations/fetch",
  async () => {
    return getConversations();
  }
);

export const createConversationThunk = createAsyncThunk(
  "conversations/create",
  async (data: Conversation) => {
    return postNewConversation(data);
  }
);

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<Conversation>) => {
      console.log("addConversation");
      state.conversations.unshift(action.payload);
    },
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      console.log("Inside updateConversation");
      console.log(action.payload);
      const conversation = action.payload;
      const index = state.conversations.findIndex(
        (c) => c._id === conversation._id
      );
      state.conversations.splice(index, 1);
      state.conversations.unshift(conversation);
    },
    deleteMember: (state, action: PayloadAction<any>) => {
      console.log("Inside deleteMember");
      console.log(action.payload);
      const { groupId, userId } = action.payload;
      const index = state.conversations.findIndex((c) => c._id === groupId);
      const indexMember = state.conversations[index].member.findIndex(
        (user) => user._id === userId
      );
      state.conversations[index].member.splice(indexMember, 1);
    },
    transferOwner: (state, action: PayloadAction<any>) => {
      console.log("Inside transferOner");
      console.log(action.payload);
      const { groupId, user } = action.payload;
      const index = state.conversations.findIndex((c) => c._id === groupId);
      state.conversations[index].owner = user;
    },
    deleteConversation: (state, action: PayloadAction<any>) => {
      console.log("Inside deleteConversation");
      console.log(action.payload);
      const { groupId } = action.payload;
      const index = state.conversations.findIndex((c) => c._id === groupId);
      state.conversations.splice(index, 1);
    },
    addMemberToConversation: (state, action: PayloadAction<Conversation>) => {
      console.log("Inside addMemberToConversation");
      console.log(action.payload);
      const index = state.conversations.findIndex((c) => c._id === action.payload._id);
      if (index === -1) {
        state.conversations.unshift(action.payload);
      } else {
        state.conversations.splice(index, 1);
        state.conversations.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationsThunk.fulfilled, (state, action) => {
        state.conversations = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchConversationsThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createConversationThunk.fulfilled, (state, action) => {
        console.log("Fulfilled" + JSON.stringify(action.payload.data));
        const conversation: Conversation = action.payload.data;
        if (!state.conversations.some((conv) => conv._id === conversation._id))
          state.conversations.unshift(conversation);
      });
  },
});

const selectConversations = (state: RootState) =>
  state.conversation.conversations;
const selectConversationId = (state: RootState, id: string) => id;

export const selectConversationById = createSelector(
  [selectConversations, selectConversationId],
  (conversations, conversationId) =>
    conversations.find((c) => c._id === conversationId)
);

// Action creators are generated for each case reducer function
export const {
  addConversation,
  updateConversation,
  deleteMember,
  deleteConversation,
  transferOwner,
  addMemberToConversation,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;
