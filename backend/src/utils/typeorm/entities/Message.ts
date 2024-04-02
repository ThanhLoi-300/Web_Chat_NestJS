import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseMessage } from './BaseMessage';
import { Conversation } from './Conversation';
import { Transform } from 'class-transformer';

@Entity({ name: 'messages' })
export class Message extends BaseMessage {
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @Column({ type: 'simple-array', nullable: true })
  attachments: string[];
}