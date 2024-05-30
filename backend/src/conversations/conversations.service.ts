import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from 'src/users/interfaces/user';
import { Services } from 'src/utils/constants';
import { Conversation, Message, User } from 'src/utils/typeorm';
import {
  AccessParams,
  ConversationResponse,
  CreateConversationParams,
  GetConversationMessagesParams,
  UpdateConversationParams,
} from 'src/utils/types';
import { IConversationsService } from './conversation';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
// import { IFriendsService } from 'src/friends/friends';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    @Inject(Services.USERS) private readonly userService: IUserService,
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    // @Inject(Services.FRIENDS_SERVICE)
    // private readonly friendsService: IFriendsService,
  ) {}
  async findById(id: string, userId: string): Promise<Conversation> {
    let lastMessage = await this.messageModel
      .find({ conversationId: id })
      .sort({ createdAt: -1 })[0];

    // Kiểm tra xem user id có trong mảng seen của lastMessage chưa
    if (lastMessage && !lastMessage?.seen?.includes(userId)) {
      // Nếu chưa có, thêm user id vào mảng seen
      lastMessage.seen.push(userId);
      await lastMessage.save();
    }

    return await this.conversationModel
      .findById(id)
      .populate('member')
      .populate('lastMessageId')
      .populate('owner');
  }

  async createConversation(idUser: string, params: CreateConversationParams) {
    const { _id, type, nameGroup, member } = params;
    const array = member.map((user: User) => user._id.toString());

    // Kiểm tra xem đã có cuộc trò chuyện tồn tại với cùng thành viên chưa
    const existingConversation = await this.conversationModel
      .findOne({
        member: { $all: array },
        type: 'private',
      })
      .populate('member')
      .populate('lastMessageId')
      .populate('owner');

    if (existingConversation) {
      return { existed: true, conversation: existingConversation };
    }

    let newConversation;
    if (type === 'group') {
      newConversation = new this.conversationModel({
        type,
        nameGroup,
        member: array,
        owner: idUser,
      });
    } else {
      newConversation = new this.conversationModel({
        type,
        member: array,
      });
    }

    let savedConversation = await newConversation.save();
    const conversation = await this.conversationModel
      .findById(savedConversation._id)
      .populate('member')
      .populate('lastMessageId')
      .populate('owner');

    return { existed: false, conversation };
  }

  async getConversations(id: string): Promise<Conversation[]> {
    return await this.conversationModel
      .find({ member: { $in: [id] } })
      .populate({
        path: 'lastMessageId',
        populate: {
          path: 'senderId',
        },
      })
      .populate('owner')
      .populate('member');
  }

  async hasAccess({ id, userId }: AccessParams) {
    const conversation = await this.conversationModel
      .findOne({
        _id: id,
      })
      .exec();

    const check = conversation?.member?.find(
      (member: string) => member === userId,
    );
    return check ? true : false;
  }

  async save(id: string, conversation: Conversation): Promise<Conversation> {
    return await this.conversationModel.findByIdAndUpdate(id, conversation, {
      new: true,
    });
  }

  async update({ id, lastMessage }: UpdateConversationParams) {
    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      id,
      { lastMessageId: lastMessage },
      { new: true },
    );

    return this.conversationModel
      .findById(updatedConversation._id)
      .populate('owner')
      .populate('member')
      .populate({
        path: 'lastMessageId',
        populate: {
          path: 'senderId',
        },
      });
  }

  async searchConversation(query: string) {
    const conversations = await this.conversationModel
      .find()
      .populate({
        path: 'lastMessageId',
        populate: {
          path: 'senderId',
        },
      })
      .populate('owner')
      .populate('member');

    // Lọc các cuộc trò chuyện dựa trên tên nhóm hoặc tên thành viên
    return conversations.filter((conversation) => {
      return (
        conversation.nameGroup?.toLowerCase().includes(query.toLowerCase()) ||
        conversation.member.some((member) => {
          return member.name.toLowerCase().includes(query.toLowerCase());
        })
      );
    });
  }

  async deleteMember(id: string, userId: string) {
    const conversation = await this.conversationModel.findById(id);

    if (!conversation) return;

    const indexOfId = conversation.member.findIndex((id) => id === userId);
    if (indexOfId !== -1) {
      conversation.member.splice(indexOfId, 1);
      await conversation.save();
    } else {
      console.log('Không tìm thấy id trong mảng.');
    }
  }

  async updateGroupOwner(id: string, userId: string) {
    const updatedConversation = await this.conversationModel.findByIdAndUpdate(
      id,
      { owner: userId },
      { new: true },
    );
    console.log(updatedConversation.owner);
  }

  async checkConversationExists(recipientId: string, userId: string) {
    const isExist = await this.conversationModel
      .findOne({ members: { $all: [recipientId, userId] }, type: 'private' })
      .populate({
        path: 'lastMessageId',
        populate: {
          path: 'senderId',
        },
      })
      .populate('owner')
      .populate('member');
    if (isExist) return isExist;
    else throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST);
  }

  async addMemberToConversation(id: string, recipentIds: string[]) {
    const conversation: ConversationResponse =
      await this.conversationModel.findById(id);

    if (!conversation)
      throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST);
    // Create a set from the existing members for faster lookups
    const existingMembers = new Set(conversation.member);

    // Filter the recipentIds array to get only the unique members that are not already in the conversation
    const newMembers = recipentIds.filter((id) => !existingMembers.has(id));

    // Add the new members to the conversation.member array
    conversation.member.push(...newMembers);

    // Save the updated conversation
    await this.conversationModel.findByIdAndUpdate(conversation._id, {
      member: [...conversation.member]
    });
  }
}
