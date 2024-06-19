import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteMessage as deleteMessageAPI,
  editMessage as editMessageAPI,
  // createMessage as createMessageAPI,
  getConversationMessages,
  fetchMessage,
} from "../../utils/api";
import {
  DeleteMessageParams,
  EditMessagePayload,
} from '../../utils/types';

export const fetchMessagesThunk = createAsyncThunk(
  'messages/fetch',
  (id: string) => {
    console.log("data mess: " + JSON.stringify(getConversationMessages(id)));
    return getConversationMessages(id);
  }
);

export const fetchMessagesAll: any = createAsyncThunk(
  "messages/fetchAll",
  () => {
    return fetchMessage();
  }
);

export const deleteMessageThunk = createAsyncThunk(
  'messages/delete',
  (params: DeleteMessageParams) => {
    return deleteMessageAPI(params);
  }
);

export const editMessageThunk = createAsyncThunk(
  'messages/edit',
  (params: EditMessagePayload) => {
    return editMessageAPI(params);
  }
);