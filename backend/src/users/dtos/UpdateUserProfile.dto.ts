import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserProfileDto {
  banner?: string;
  name?: string;
  avatar?: string;
}