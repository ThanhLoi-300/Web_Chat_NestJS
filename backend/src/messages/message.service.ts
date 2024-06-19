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

  async fetchMessages(userId: string) {
    const conversations = await this.conversationService
      .getConversationsOfUser(userId);
    
    let array: any = []
    
    const promises = conversations.map(async (c) => {
      const messages = await this.messageModel
        .find({ conversationId: c._id })
        .populate('seen')
        .populate('senderId')
        .populate('conversationId');
      array.push({ _id: c._id, messages });
    });

    await Promise.all(promises);
    return array
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
    const messagesOfConversation = await this.messageModel.find({ conversationId: message.conversationId })
    const lastMessage = messagesOfConversation.slice(-6);

    const promises = lastMessage.map(async (m: Message) => {
      if (!m.seen.includes(userId)) {
        await this.messageModel.findByIdAndUpdate(m._id, {
          $push: { seen: userId },
        });
      }
    });

    await Promise.all(promises);
  }
}
