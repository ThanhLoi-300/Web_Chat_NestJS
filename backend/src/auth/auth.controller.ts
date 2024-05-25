import {
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { IUserService } from 'src/users/interfaces/user';
import { Routes, Services } from '../utils/constants';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { LoginUserDto } from './dtos/LoginUserDto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/utils/typeorm';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService,
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
      const accessToken = this.jwtService.sign({ id: user._id });
      return { access_token: accessToken };
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }
}
