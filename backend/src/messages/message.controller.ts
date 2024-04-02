import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UploadedFiles } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IMessageService } from './message';
import { CreateConversationDto } from 'src/conversations/dtos/CreateConversation';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { CreateMessageDto } from './dtos/CreateMessageDto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EditMessageDto } from './dtos/EditMessageDto';

@Controller(Routes.MESSAGES)
export class MessageController {
    constructor(
        @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
        private eventEmitter: EventEmitter2
    ) { }
    
    @Post("/:id") async createMessage(@AuthUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        //@UploadedFiles() { attachments }: { attachments: Attachment[] },
        @Body() { content }: CreateMessageDto) {
        //if (!attachments && !content) throw new EmptyMessageException();
        const params = { user, id, content, attachments: null };
        const response = await this.messageService.createMessage(params);
        this.eventEmitter.emit('message.create', response);
        return;
    }

    @Get()
    //@SkipThrottle()
    async getMessagesFromConversation( @AuthUser() user: User, @Param('id', ParseIntPipe) id: number, ) {
        const messages = await this.messageService.getMessages(id);
        return { id, messages };
    }

    @Delete(':messageId')
    async deleteMessageFromConversation(
        @AuthUser() user: User,
        @Param('id', ParseIntPipe) conversationId: number,
        @Param('messageId', ParseIntPipe) messageId: number,
    ) {
        const params = { userId: user.id, conversationId, messageId };
        await this.messageService.deleteMessage(params);
        this.eventEmitter.emit('message.delete', params);
        return { conversationId, messageId };
    }
    // api/conversations/:conversationId/messages/:messageId
    @Patch(':messageId')
    async editMessage(
        @AuthUser() { id: userId }: User,
        @Param('id') conversationId: number,
        @Param('messageId') messageId: number,
        @Body() { content }: EditMessageDto,
    ) {
        const params = { userId, content, conversationId, messageId };
        const message = await this.messageService.editMessage(params);
        this.eventEmitter.emit('message.update', message);
        return message;
    }
}
