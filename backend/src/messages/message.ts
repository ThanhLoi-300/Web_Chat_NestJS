import { Message } from "src/utils/typeorm";
import { CreateMessageParams, CreateMessageResponse, DeleteMessageParams, EditMessageParams,  } from "src/utils/types";

export interface IMessageService {
  createMessage(
    createMessageParams: CreateMessageParams,
  ): Promise<CreateMessageResponse>;
  getMessages(id: string): Promise<Message[]>;
  deleteMessage(params: DeleteMessageParams): Promise<Message>;
  // editMessage(params: EditMessageParams): Promise<Message>;
  updateSeenMessage(userId: string, messageId: string);
}