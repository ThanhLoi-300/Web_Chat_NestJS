import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile, User } from 'src/utils/typeorm';
import { Services } from '../utils/constants';
import { UsersController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserProfilesController } from './controllers/user-profile.controller';
import { UserProfileService } from './services/user-profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
  ],
  controllers: [
    UsersController,
    UserProfilesController,
  ],
  providers: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
    {
      provide: Services.USERS_PROFILES,
      useClass: UserProfileService,
    },
  ],
  exports: [
    {
      provide: Services.USERS,
      useClass: UserService,
    },
    {
      provide: Services.USERS_PROFILES,
      useClass: UserProfileService,
    },
  ],
})
export class UsersModule {}
