import { Column, Entity, ManyToOne, } from 'typeorm';
import { BaseMessage } from './BaseMessage';
import { Group } from './Group';
import { Transform } from 'class-transformer';

@Entity({ name: 'group_messages' })
export class GroupMessage extends BaseMessage {
  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;

  @Column({ type: 'simple-array', nullable: true })
  attachments: string[];
}