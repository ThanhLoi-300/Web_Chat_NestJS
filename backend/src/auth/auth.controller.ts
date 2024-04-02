import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { IUserService } from 'src/users/interfaces/user';
import { Routes, Services } from '../utils/constants';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { AuthenticatedGuard, LocalAuthGuard } from './utils/Guards';
import { ISessionManager } from './Session';
import { LoginUserDto } from './dtos/LoginUserDto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/utils/typeorm';
import * as crypto from 'crypto';
import { AuthenticatedRequest } from 'src/utils/types';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService,
    @Inject(Services.PUSHER_SESSION) readonly sessions: ISessionManager,
    @Inject(Services.USERS) private userService: IUserService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return instanceToPlain(await this.userService.createUser(createUserDto));
  }

  @Post('login')
  async login(@Body() infoLogin: LoginUserDto) {
    try {
      const user: User = await this.authService.validateUser(infoLogin);
      const accessToken = this.jwtService.sign({ id: user.id });
      this.sessions.setUserPusher(user)
      console.log(this.sessions.getPushers.length)
      return { access_token: accessToken };
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }

  @Get('status')
  @UseGuards(AuthenticatedGuard)
  async status(@Req() req: Request, @Res() res: Response) {
    res.send(req.user);
  }

  @Post('logout')
  logout(@Req() req: AuthenticatedRequest,) {
    this.sessions.removeUserPusher(req.userId)
    console.log(this.sessions.getPushers.length)
  }
}
