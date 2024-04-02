import { ArrayNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  users: number[];

  title: string;
}