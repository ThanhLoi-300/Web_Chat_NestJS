import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import {
  ConversationMessage,
  MessageEventPayload,
  UpdateMessageSeen,
  MessageType,
} from "../../utils/types";
import {
  deleteMessageThunk,
  editMessageThunk,
  fetchMessagesThunk,
  fetchMessagesAll,
} from "./messageThunk";

export interface MessagesState {
  messages: ConversationMessage[];
  loading: boolean;
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<MessageEventPayload>) => {
      console.log(state);
      console.log("test action: "+JSON.stringify(action.payload));
      const { conversation, message } = action.payload;
      const conversationMessage = state.messages.find(
        (cm) => cm._id === conversation._id
      );
      conversationMessage?.messages.unshift(message);
    },
    deleteMessage: (state, action: PayloadAction<any>) => {
      console.log("Inside deleteMessage reducer");
      const { payload } = action;
      const conversationId = payload.conversationId._id
        ? payload.conversationId._id
        : payload.conversationId;
      const conversationMessages = state.messages.find(
        (cm) => cm._id === conversationId
      );
      if (!conversationMessages) return;
      const messageIndex = conversationMessages.messages.findIndex(
        (m) => m._id === payload._id
      );
      console.log("index: " + messageIndex);
      conversationMessages.messages[messageIndex].isdeleted = true;
    },
    updateMessageSeen: (state, action: PayloadAction<UpdateMessageSeen>) => {
      console.log("updateMessageSeen");
      const conversationMessage = state.messages.find(
        (cm) => cm._id === action.payload.conversationId
      );
      if (!conversationMessage) return;
      const lastMessages = conversationMessage.messages.slice(0, 6)

      lastMessages.map((m: MessageType) => {
        if (!m.seen.some((u) => u._id !== action.payload.user._id)) {
          m.seen.push(action.payload.user);
          console.log("uopdate")
        }
      })
      const messageIndex = conversationMessage.messages.findIndex(
        (m) => m._id === action.payload.messageId
      );
      // console.log("index"+ messageIndex)
      if (
        conversationMessage.messages[messageIndex].seen.filter(
          (u) => u._id === action.payload.user._id
        ).length === 0
      )
        conversationMessage.messages[messageIndex].seen.push(
          action.payload.user
        );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        // console.log("data mess: " + JSON.stringify(action.payload.data));
        const { _id } = action.payload.data;
        const index = state.messages.findIndex((cm) => cm._id === _id);
        const exists = state.messages.find((cm) => cm._id === _id);
        if (exists) {
          console.log("exists");
          state.messages[index] = action.payload.data;
        } else {
          state.messages.push(action.payload.data);
        }
      })
      .addCase(deleteMessageThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        const conversationMessages = state.messages.find(
          (cm) => cm._id === data.conversationId
        );
        if (!conversationMessages) return;
        const messageIndex = conversationMessages.messages.findIndex(
          (m) => m._id === data.messageId
        );
        conversationMessages?.messages.splice(messageIndex, 1);
      })
      .addCase(editMessageThunk.fulfilled, (state, action) => {
        console.log("editMessageThunk.fulfilled");
        const { data: message } = action.payload;
        const { _id } = message.conversation;
        const conversationMessage = state.messages.find((cm) => cm._id === _id);
        if (!conversationMessage) return;
        const messageIndex = conversationMessage.messages.findIndex(
          (m) => m._id === message._id
        );
        console.log(messageIndex);
        conversationMessage.messages[messageIndex] = message;
        console.log("Updated Message");
      })
      .addCase(fetchMessagesAll.fulfilled, (state, action) => {
        // console.log("data mess: " + JSON.stringify(action.payload.data));
        state.messages = action.payload.data;
      });
  },
});

const selectConversationMessages = (state: RootState) => state.messages.messages;

const selectConversationMessageId = (state: RootState, id: string) => {
  console.log(state)
  return id;
}

export const selectConversationMessage = createSelector(
  [selectConversationMessages, selectConversationMessageId],
  (conversationMessages, id) => conversationMessages.find((cm: any) => cm._id === id)
);

export const { addMessage, deleteMessage, updateMessageSeen } =
  messagesSlice.actions;

export default messagesSlice.reducer;