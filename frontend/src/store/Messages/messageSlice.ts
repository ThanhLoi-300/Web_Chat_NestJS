import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import {
  ConversationMessage,
  DeleteMessageResponse,
  MessageEventPayload,
  MessageType,
} from '../../utils/types';
import { deleteMessageThunk, editMessageThunk, fetchMessagesThunk } from './messageThunk';

export interface MessagesState {
  messages: ConversationMessage[];
  loading: boolean;
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<MessageEventPayload>) => {
      console.log(state);
      console.log(action);
      const { conversation, message } = action.payload;
      const conversationMessage = state.messages.find((cm) => cm._id === conversation._id);
      conversationMessage?.messages.unshift(message);
    },
    deleteMessage: (state, action: PayloadAction<DeleteMessageResponse>) => {
      console.log('Inside deleteMessage reducer');
      const { payload } = action;
      const conversationMessages = state.messages.find((cm) => cm._id === payload.conversationId);
      if (!conversationMessages) return;
      const messageIndex = conversationMessages.messages.findIndex(
        (m) => m._id === payload.messageId
      );
      conversationMessages.messages.splice(messageIndex, 1);
    },
    editMessage: (state, action: PayloadAction<MessageType>) => {
      console.log('editMessageReducer');
      const message = action.payload;
      const conversationMessage = state.messages.find((cm) => cm._id === message.conversation._id);
      if (!conversationMessage) return;
      const messageIndex = conversationMessage.messages.findIndex((m) => m._id === message._id);
      conversationMessage.messages[messageIndex] = message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        console.log("data mess: " + JSON.stringify(action.payload.data));
        const { _id, messages } = action.payload.data;
        const index = state.messages.findIndex((cm) => cm._id === _id);
        const exists = state.messages.find((cm) => cm._id === _id);
        if (exists) {
          console.log('exists');
          state.messages[index] = action.payload.data;
        } else {
          state.messages.push(action.payload.data);
        }
      })
      .addCase(deleteMessageThunk.fulfilled, (state, action) => {
        const { data } = action.payload;
        const conversationMessages = state.messages.find((cm) => cm._id === data.conversationId);
        if (!conversationMessages) return;
        const messageIndex = conversationMessages.messages.findIndex(
          (m) => m._id === data.messageId
        );
        conversationMessages?.messages.splice(messageIndex, 1);
      })
      .addCase(editMessageThunk.fulfilled, (state, action) => {
        console.log('editMessageThunk.fulfilled');
        const { data: message } = action.payload;
        const { _id } = message.conversation;
        const conversationMessage = state.messages.find((cm) => cm._id === _id);
        if (!conversationMessage) return;
        const messageIndex = conversationMessage.messages.findIndex((m) => m._id === message._id);
        console.log(messageIndex);
        conversationMessage.messages[messageIndex] = message;
        console.log('Updated Message');
      });
  },
});

const selectConversationMessages = (state: RootState) => state.messages.messages;

const selectConversationMessageId = (state: RootState, id: string) => id;

export const selectConversationMessage = createSelector(
  [selectConversationMessages, selectConversationMessageId],
  (conversationMessages, id) => conversationMessages.find((cm) => cm._id === id)
);

export const { addMessage, deleteMessage, editMessage } = messagesSlice.actions;

export default messagesSlice.reducer;