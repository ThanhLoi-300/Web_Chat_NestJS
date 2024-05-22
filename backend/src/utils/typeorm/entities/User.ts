import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'users' })
export class User extends Document {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  banner: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
