import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Services } from '../../utils/constants';
import { generateUUIDV4 } from '../../utils/helpers';
import { Profile, User } from '../../utils/typeorm';
import { IUserProfile } from '../interfaces/user-profile';

@Injectable()
export class UserProfileService implements IUserProfile {
  constructor(
    // @InjectRepository(Profile)
    // private readonly profileRepository: Repository<Profile>,
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
  ) {}

  createProfile() {
    // const newProfile = this.profileRepository.create();
    // return this.profileRepository.save(newProfile);
  }

  async createProfileOrUpdate(user: User, params: any) {
  //   console.log('CreateProfileOrUpdate');
  //   if (!user.profile) {
  //     console.log('User has no profile. Creating...');
  //     user.profile = await this.createProfile();
  //     return this.updateProfile(user, params);
  //   }
  //   console.log('User has profile');
  //   return this.updateProfile(user, params);
  }
}