import { Conversation, User } from "src/utils/typeorm";
import { AccessParams, CreateConversationParams, GetConversationMessagesParams, UpdateConversationParams } from "src/utils/types"

export interface IConversationsService {
  createConversation(idUser: string, params: CreateConversationParams);
  getConversations(id: string): Promise<Conversation[]>;
  findById(id: string, userId: string): Promise<Conversation | undefined>;
  hasAccess(params: AccessParams): Promise<boolean>;
  save(id: string, conversation: Conversation): Promise<Conversation>;
  // getMessages(params: GetConversationMessagesParams): Promise<Conversation>;
  update(params: UpdateConversationParams);
  searchConversation(query: string);
  deleteMember(id: string, userId: string);
  updateGroupOwner(id: string, userId: string);
}