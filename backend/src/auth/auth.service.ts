import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IUserService } from 'src/users/interfaces/user';
import { Services } from 'src/utils/constants';
import { compareHash } from 'src/utils/helpers';
import { ValidateUserDetails } from 'src/utils/types';
import { IAuthService } from './auth';
import { User } from 'src/utils/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private userServices: IUserService,
    private jwtService: JwtService,
  ) {}

  validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      console.log('error: ' + JSON.stringify(error));
      throw new Error('Invalid token');
    }
  }
  async validateUser(userDetails: ValidateUserDetails) {
    const user = await this.userServices.findUser({ email: userDetails.email });
    if (!user)
      throw new HttpException('Invalid Credential', HttpStatus.UNAUTHORIZED);

    const isPasswordValid = compareHash(userDetails.password, user.password);
    return isPasswordValid ? user : null;
  }
}
