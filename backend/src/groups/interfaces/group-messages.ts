import { GroupMessage } from '../../utils/typeorm';
import {
  CreateGroupMessageParams,
  CreateGroupMessageResponse,
  DeleteGroupMessageParams,
  EditGroupMessageParams,
} from '../../utils/types';

export interface IGroupMessageService {
  createGroupMessage(params: CreateGroupMessageParams): Promise<CreateGroupMessageResponse>;
  getGroupMessages(id: number): Promise<GroupMessage[]>;
  deleteGroupMessage(params: DeleteGroupMessageParams);
  editGroupMessage(params: EditGroupMessageParams): Promise<GroupMessage>;
}