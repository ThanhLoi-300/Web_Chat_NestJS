import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User';

@Schema({ collection: 'friends' })
export class Friend {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ type: String, ref: 'User' })
  user: string;

  @Prop({ type: [{ type: String, ref: 'User' }] })
  listFriend: string[];
}

export const FriendSchema = SchemaFactory.createForClass(Friend);