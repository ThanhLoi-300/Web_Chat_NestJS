import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
  Req,
} from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { IUserService } from '../interfaces/user';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { AuthenticatedRequest } from 'src/utils/types';

@Controller(Routes.USERS)
export class UsersController {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  @Get('search')
  async searchUsers(@Req() req: AuthenticatedRequest, @Query('query') query: string) {
    if (!query)
      throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);
    const user = await this.userService.findUser({id: req.userId})
    return this.userService.searchUsers(query, user);
  }

  @Get()
  getUser(@Req() req: AuthenticatedRequest) {
    return this.userService.findUser({ id: req.userId });
  }

  @Get('check')
  async checkUsername(@Query('name') name: string) {
    if (!name)
      throw new HttpException('Invalid Query', HttpStatus.BAD_REQUEST);
    const user = await this.userService.findUser({ name });
    if (user) throw new HttpException('User already exists', HttpStatus.CONFLICT);
    return HttpStatus.OK;
  }
}