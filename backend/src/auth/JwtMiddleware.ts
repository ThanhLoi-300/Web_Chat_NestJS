import {
  HttpException,
  HttpStatus,
  Inject,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from 'src/utils/types';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/users/interfaces/user';
import { IAuthService } from './auth';

export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
  @Inject(Services.AUTH) private authService: IAuthService) { }

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (token) {
      try {
        const decoded = await this.authService.validateToken(token);
        req.userId = decoded.id;
      } catch (err) {
        // Handle error
        console.log("err: "+ JSON.stringify(err))
      }
    }
    next();
  }
}