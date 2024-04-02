import { Message } from "src/utils/typeorm";
import { CreateMessageParams, DeleteMessageParams, EditMessageParams } from "src/utils/types";

export interface IMessageService{
    createMessage(createMessageParams: CreateMessageParams): Promise<Message>
    getMessages(id: number): Promise<Message[]>
    deleteMessage(params: DeleteMessageParams);
    editMessage(params: EditMessageParams): Promise<Message>;
}