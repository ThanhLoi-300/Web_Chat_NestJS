import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { FriendRequestStatus } from 'src/utils/types';

@Schema({ collection: 'friend_requests' })
export class FriendRequest {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ type: String, ref: 'User' })
  sender: string;

  @Prop({ type: String, ref: 'User' })
  receiver: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  status: FriendRequestStatus;
}
export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
