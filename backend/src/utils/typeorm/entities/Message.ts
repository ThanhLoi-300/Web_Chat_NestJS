import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Conversation } from './Conversation';
import { User } from './User';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'messages' })
export class Message {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop()
  content: string;

  @Prop()
  img: string[];

  @Prop({ default: false })
  isdeleted: boolean;

  @Prop({ type: [{ type: String, ref: 'User' }] })
  seen: string[];

  @Prop({ type: String, ref: 'User' })
  senderId: string | User;

  @Prop({ type: String, ref: 'Conversation' })
  conversationId: string | Conversation;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);