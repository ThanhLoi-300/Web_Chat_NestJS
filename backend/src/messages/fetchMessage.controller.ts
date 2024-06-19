import {
  Controller,
  Get,
  Inject,
  Req,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IMessageService } from './message';
import { AuthenticatedRequest } from 'src/utils/types';

@Controller(Routes.FETCHMESSAGE)
export class FetchMessageController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
  ) {}

  @Get()
  async fetchMessages(@Req() req: AuthenticatedRequest) {
    const messages = await this.messageService.fetchMessages(req.userId);
    return messages;
  }
}
