import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Services } from '../../utils/constants';
import { AuthenticatedRequest } from '../../utils/types';
import { IGroupService } from '../interfaces/group';

@Injectable()
export class GroupMiddleware implements NestMiddleware {
  constructor(
    @Inject(Services.GROUPS)
    private readonly groupService: IGroupService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.userId;
    const id = parseInt(req.params.id);

    if (isNaN(id)) throw new HttpException('Invalid Group Id', HttpStatus.BAD_REQUEST);
    const params = { id, userId };
    const user = await this.groupService.hasAccess(params);

    if (user) next();
    else throw new HttpException('Group Not Found', HttpStatus.NOT_FOUND);
  }
}