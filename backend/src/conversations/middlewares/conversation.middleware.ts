import {
  Inject,
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Services } from '../../utils/constants';
import { AuthenticatedRequest } from '../../utils/types';
import { IConversationsService } from '../conversation';

@Injectable()
export class ConversationMiddleware implements NestMiddleware {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.userId;
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new HttpException('Invalid Conversation Id', HttpStatus.BAD_REQUEST);
    const isReadable = await this.conversationService.hasAccess({ id, userId });
 
    if (isReadable) next();
    else throw new HttpException('Conversation was not found', HttpStatus.NOT_FOUND);
  }
}