import { Conversation, User } from "src/utils/typeorm";
import { AccessParams, CreateConversationParams, GetConversationMessagesParams, UpdateConversationParams } from "src/utils/types"
import { UpdateGroup } from "./dtos/UpdateGroup";

export interface IConversationsService {
  createConversation(idUser: string, params: CreateConversationParams);
  getConversations(id: string): Promise<Conversation[]>;
  findById(id: string, userId: string): Promise<Conversation | undefined>;
  hasAccess(params: AccessParams): Promise<boolean>;
  save(id: string, conversation: Conversation): Promise<Conversation>;
  update(params: UpdateConversationParams);
  searchConversation(query: string);
  deleteMember(id: string, userId: string);
  updateGroupOwner(id: string, userId: string);
  checkConversationExists(recipientId: string, userId: string);
  addMemberToConversation(id: string, recipentIds: string[]);
  leaveGroup(id: string, userId: string);
  updateGroup(params: UpdateGroup)
}