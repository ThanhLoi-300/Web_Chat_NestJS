// import {
//   createAsyncThunk,
//   createSelector,
//   createSlice,
//   PayloadAction,
// } from '@reduxjs/toolkit';
// import { RootState } from '.';
// import {
//   deleteGroupMessage as deleteGroupMessageAPI,
//   fetchGroupMessages as fetchGroupMessagesAPI,
// } from '../utils/api';
// import {
//   DeleteGroupMessageParams,
//   EditMessagePayload,
//   GroupMessage,
//   GroupMessageEventPayload,
//   GroupMessageType,
//   MessageType,
// } from '../utils/types';

// export interface GroupMessagesState {
//   messages: MessageType[];
// }

// const initialState: GroupMessagesState = {
//   messages: [],
// };

// export const fetchGroupMessagesThunk = createAsyncThunk(
//   'groupMessages/fetch',
//   (id: string) => fetchGroupMessagesAPI(id)
// );

// export const deleteGroupMessageThunk = createAsyncThunk(
//   'groupMessages/delete',
//   (params: DeleteGroupMessageParams) => deleteGroupMessageAPI(params)
// );

// export const groupMessagesSlice = createSlice({
//   name: 'groupMessages',
//   initialState,
//   reducers: {
//     addGroupMessage: (
//       state,
//       action: PayloadAction<GroupMessageEventPayload>
//     ) => {
//       const { group, message } = action.payload;
//       const groupMessage = state.messages.find((gm) => gm._id === group._id);
//       // groupMessage?.messages.unshift(message);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchGroupMessagesThunk.fulfilled, (state, action) => {
//         const { id } = action.payload.data;
//         console.log('fetchGroupMessagesThunk.fulfilled');
//         console.log(action.payload.data);
//         const index = state.messages.findIndex((gm) => gm._id === id);
//         const exists = state.messages.find((gm) => gm._id === id);
//         // exists
//         //   ? (state.messages[index] = action.payload.data)
//         //   : state.messages.push(action.payload.data);
//       })
//       .addCase(deleteGroupMessageThunk.fulfilled, (state, action) => {
//         console.log('deleteGroupMessageThunk.fulfilled');

//         const { data } = action.payload;
//         const groupMessages = state.messages.find(
//           (gm) => gm._id === data.groupId
//         );
//         console.log(data);
//         console.log(groupMessages);
//         if (!groupMessages) return;
//         // const messageIndex = groupMessages.messages.findIndex(
//         //   (m) => m.id === data.messageId
//         // );
//         // groupMessages?.messages.splice(messageIndex, 1);
//       });
//   },
// });

// const selectGroupMessages = (state: RootState) => state.groupMessages.messages;
// const selectGroupMessageId = (state: RootState, id: string) => id;

// export const selectGroupMessage = createSelector(
//   [selectGroupMessages, selectGroupMessageId],
//   (groupMessages, id) => groupMessages.find((gm) => gm._id === id)
// );

// export const { addGroupMessage } = groupMessagesSlice.actions;

// export default groupMessagesSlice.reducer;