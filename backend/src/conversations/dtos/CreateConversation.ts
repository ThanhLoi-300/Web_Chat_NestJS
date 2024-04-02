import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConversationDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
