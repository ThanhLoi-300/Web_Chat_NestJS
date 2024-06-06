import { Inject, Injectable } from '@nestjs/common';
import { IMessageService } from './message';
import { Conversation, Message } from 'src/utils/typeorm';
import {
  CreateMessageParams,
  CreateMessageResponse,
  DeleteMessageParams,
  EditMessageParams,
} from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Services } from 'src/utils/constants';
import { IConversationsService } from 'src/conversations/conversation';
import { instanceToPlain } from 'class-transformer';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
// import { IFriendsService } from 'src/friends/friends';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
  ) {}

  async createMessage(
    params: CreateMessageParams,
  ): Promise<CreateMessageResponse> {
    const { user, content, id } = params;
    const conversation = await this.conversationService.findById(id, user._id);

    const message = new this.messageModel({
      content,
      conversationId: conversation._id,
      senderId: user._id,
      img: params.attachments,
      seen: [user._id],
    });

    const savedMessage = await message.save();

    conversation!.lastMessageId = savedMessage._id;

    const messageResponse = await this.messageModel
      .findById(savedMessage._id)
      .populate('seen')
      .populate('senderId')
      .populate('conversationId');

    const updated = await this.conversationService.update({
      id,
      lastMessage: savedMessage._id,
    });

    return { message: messageResponse, conversation: updated };
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messageModel
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .populate('seen')
      .populate('senderId');
  }

  async deleteMessage(params: DeleteMessageParams): Promise<Message> {
    const { messageId } = params;

    let message = await this.messageModel
      .findByIdAndUpdate(
        messageId,
        {
          isdeleted: true,
        },
        { new: true },
      )
      .populate('conversationId');

    return message;
  }

  async updateSeenMessage(userId: string, messageId: string) {
    const message = await this.messageModel.findById(messageId);

    if (!message.seen.includes(userId)) {
      // Nếu chưa có, thêm userId vào mảng
      message.seen.push(userId);
      await message.save();
    }
  }

  // async deleteLastMessage(conversation: Conversation, message: Message) {
  //   const size = conversation.messages.length;
  //   const SECOND_MESSAGE_INDEX = 1;
  //   if (size <= 1) {
  //     console.log('Last Message Sent is deleted');
  //     await this.conversationService.update({
  //       id: conversation.id,
  //       lastMessageSent: null,
  //     });
  //     return this.messageRepository.delete({ id: message.id });
  //   } else {
  //     console.log('There are more than 1 message');
  //     const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX];
  //     await this.conversationService.update({
  //       id: conversation.id,
  //       lastMessageSent: newLastMessage,
  //     });
  //     return this.messageRepository.delete({ id: message.id });
  //   }
  // }

  // async editMessage(params: EditMessageParams) {
  //   const messageDB = await this.messageRepository.findOne({
  //     where: {
  //       id: params.messageId,
  //       author: { id: params.userId },
  //     },
  //     relations: [
  //       'conversation',
  //       'conversation.creator',
  //       'conversation.recipient',
  //       'author',
  //       'author.profile',
  //     ],
  //   });
  //   // if (!messageDB)
  //   // throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
  //   messageDB.content = params.content;
  //   return this.messageRepository.save(messageDB);
  // }
}
