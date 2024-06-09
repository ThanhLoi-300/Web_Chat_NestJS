import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '.';
import {
  fetchGroups as fetchGroupsAPI,
  removeGroupRecipient as removeGroupRecipientAPI,
  updateGroupOwner as updateGroupOwnerAPI,
  leaveGroup as leaveGroupAPI,
} from '../utils/api';
import {
  Conversation,
  Points,
  RemoveGroupRecipientParams,
  UpdateGroupOwnerParams,
} from '../utils/types';

export interface GroupState {
  groups: Conversation[];
  showGroupContextMenu: boolean;
  selectedGroupContextMenu?: Conversation;
  showEditGroupModal: boolean;
  points: Points;
  isSavingChanges: boolean;
}

const initialState: GroupState = {
  groups: [],
  showGroupContextMenu: false,
  showEditGroupModal: false,
  points: { x: 0, y: 0 },
  isSavingChanges: false,
};

export const fetchGroupsThunk = createAsyncThunk('groups/fetch', () => {
  return fetchGroupsAPI();
});

export const removeGroupRecipientThunk = createAsyncThunk(
  'groups/recipients/delete',
  (params: RemoveGroupRecipientParams) => removeGroupRecipientAPI(params)
);

export const updateGroupOwnerThunk = createAsyncThunk(
  'groups/owner/update',
  (params: UpdateGroupOwnerParams) => updateGroupOwnerAPI(params)
);

export const leaveGroupThunk = createAsyncThunk('groups/leave', (id: string) =>
  leaveGroupAPI(id)
);

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<Conversation>) => {
      console.log(`addGroup reducer: Adding ${action.payload._id} to state`);
      state.groups.unshift(action.payload);
    },
    updateGroup: () => {
      
    },
    removeGroup: (state, action: PayloadAction<Conversation>) => {
      console.log("removeGroup Reducer");
      const group = state.groups.find((g) => g._id === action.payload._id);
      const index = state.groups.findIndex((g) => g._id === action.payload._id);
      if (!group) return;
      state.groups.splice(index, 1);
    },
    toggleContextMenu: (state, action: PayloadAction<boolean>) => {
      state.showGroupContextMenu = action.payload;
    },
    setSelectedGroup: (state, action: PayloadAction<Conversation>) => {
      state.selectedGroupContextMenu = action.payload;
    },
    setContextMenuLocation: (state, action: PayloadAction<Points>) => {
      state.points = action.payload;
    },
    setShowEditGroupModal: (state, action: PayloadAction<boolean>) => {
      state.showEditGroupModal = action.payload;
    },
    setIsSavingChanges: (state, action: PayloadAction<boolean>) => {
      state.isSavingChanges = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupsThunk.fulfilled, (state, action) => {
        console.log(action.payload.data);
        state.groups = action.payload.data;
        console.log(state.groups);
      })
      .addCase(removeGroupRecipientThunk.fulfilled, (state, action) => {
        const { data: updatedGroup } = action.payload;
        console.log("removeGroupRecipientThunk.fulfilled");
        const existingGroup = state.groups.find(
          (g) => g._id === updatedGroup._id
        );
        const index = state.groups.findIndex((g) => g._id === updatedGroup._id);
        if (existingGroup) {
          state.groups[index] = updatedGroup;
          console.log("Updating Group....");
        }
      })
  },
});

const selectGroups = (state: RootState) => state.groups.groups;
const selectGroupId = (id: string) => id;

export const selectGroupById = createSelector(
  [selectGroups, selectGroupId],
  (groups, groupId) => groups.find((g) => g._id === groupId)
);

export const {
  addGroup,
  updateGroup,
  removeGroup,
  toggleContextMenu,
  setContextMenuLocation,
  setSelectedGroup,
  setShowEditGroupModal,
  setIsSavingChanges,
} = groupsSlice.actions;

export default groupsSlice.reducer;