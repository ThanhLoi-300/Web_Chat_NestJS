import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Message } from './Message';
import { User } from './User';
import mongoose, { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'conversations' })
export class Conversation {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop([{ type: String, ref: 'User' }])
  member: string[] | User[];

  @Prop()
  type: string;

  @Prop()
  nameGroup: string;

  @Prop()
  imgGroup: string;

  @Prop({ type: String, ref: 'User' })
  owner: string | User;

  @Prop({ type: String, ref: 'Message' })
  lastMessageId: string | Message;
}
export const ConversationSchema = SchemaFactory.createForClass(Conversation);