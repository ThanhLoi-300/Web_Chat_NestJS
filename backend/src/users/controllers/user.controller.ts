import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { IUserService } from '../interfaces/user';
import { AuthenticatedRequest } from 'src/utils/types';
import { UpdateUserProfileDto } from '../dtos/UpdateUserProfile.dto';

@Controller(Routes.USERS)
export class UsersController {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  @Get('search')
  async searchUsers(
    @Req() req: AuthenticatedRequest,
    @Query('query') query: string,
  ) {
    if (!query)
      throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);
    const user = await this.userService.findUser({ _id: req.userId });
    return this.userService.searchUsers(query, user);
  }

  @Get()
  async getUser(@Req() req: AuthenticatedRequest) {
    return await this.userService.findUser({ _id: req.userId });
  }

  @Patch('profiles')
  async updateUserProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userService.createProfileOrUpdate(req.userId, updateUserProfileDto);
  }
}