import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteMember {
    id: string;
    userId: string;
}
