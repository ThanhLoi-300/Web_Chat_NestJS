import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from 'src/users/interfaces/user';
import { Services } from 'src/utils/constants';
import { Conversation, Message, User } from 'src/utils/typeorm';
import { AccessParams, CreateConversationParams, GetConversationMessagesParams, UpdateConversationParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IConversationsService } from './conversation';

@Injectable()
export class ConversationsService implements IConversationsService{
    constructor(
        @InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>,
        @Inject(Services.USERS) private readonly userService: IUserService,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        //@Inject(Services.FRIENDS_SERVICE) private readonly friendsService: IFriendsService,
    ) { }
    
    async createConversation(creator: User, params: CreateConversationParams) {
        const { id, message: content } = params;
        const recipient = await this.userService.findUser({ id });
        
        // const isFriends = await this.friendsService.isFriends(
        //     creator.id,
        //     recipient.id,
        // );
        // if (!isFriends) throw new FriendNotFoundException();

        const exists = await this.isCreated(creator.id, recipient.id);
        if (exists) throw new HttpException('Conversation Already Exists', HttpStatus.CONFLICT);

        const newConversation = this.conversationRepository.create({
            creator,
            recipient,
        });

        const conversation = await this.conversationRepository.save(
            newConversation,
        );

        const newMessage = this.messageRepository.create({
            content,
            conversation,
            author: creator,
        });

        conversation.lastMessageSent = newMessage
        await this.conversationRepository.save(conversation)
        
        await this.messageRepository.save(newMessage);
        return conversation;
    }

    async getConversations(id: number): Promise<Conversation[]> {
        return this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
        .leftJoinAndSelect('conversation.creator', 'creator')
        .leftJoinAndSelect('conversation.recipient', 'recipient')
        // .leftJoinAndSelect('creator.peer', 'creatorPeer')
        // .leftJoinAndSelect('recipient.peer', 'recipientPeer')
        .leftJoinAndSelect('creator.profile', 'creatorProfile')
        .leftJoinAndSelect('recipient.profile', 'recipientProfile')
        .where('creator.id = :id', { id })
        .orWhere('recipient.id = :id', { id })
        .orderBy('conversation.lastMessageSentAt', 'DESC')
        .getMany();
    }

    async findById(id: number) {
        return this.conversationRepository.findOne({
        where: { id },
        relations: [
            'creator',
            'recipient',
            'creator.profile',
            'recipient.profile',
            'lastMessageSent',
        ],
        });
    }

    async isCreated(userId: number, recipientId: number) {
        return this.conversationRepository.findOne({
            where: [
                {
                creator: { id: userId },
                recipient: { id: recipientId },
                },
                {
                creator: { id: recipientId },
                recipient: { id: userId },
                },
            ],
        });
    }

    async hasAccess({ id, userId }: AccessParams) {
        const conversation = await this.findById(id);

        //if (!conversation) throw new ConversationNotFoundException();

        return ( conversation.creator.id === userId || conversation.recipient.id === userId );
    }

    save(conversation: Conversation): Promise<Conversation> {
        return this.conversationRepository.save(conversation);
    }

    getMessages({ id, limit,}: GetConversationMessagesParams): Promise<Conversation> {
        return this.conversationRepository
        .createQueryBuilder('conversation')
        .where('id = :id', { id })
        .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
        .leftJoinAndSelect('conversation.messages', 'message')
        .where('conversation.id = :id', { id })
        .orderBy('message.createdAt', 'DESC')
        .limit(limit)
        .getOne();
    }

    update({ id, lastMessageSent }: UpdateConversationParams) {
        return this.conversationRepository.update(id, { lastMessageSent });
    }
}
