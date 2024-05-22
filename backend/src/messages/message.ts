import { Message } from "src/utils/typeorm";
import { CreateMessageParams, CreateMessageResponse, DeleteMessageParams, EditMessageParams, deleteMessageResponse } from "src/utils/types";

export interface IMessageService {
  createMessage(
    createMessageParams: CreateMessageParams,
  ): Promise<CreateMessageResponse>;
  getMessages(id: string): Promise<Message[]>;
  deleteMessage(params: DeleteMessageParams): Promise<deleteMessageResponse>;
  // editMessage(params: EditMessageParams): Promise<Message>;
}