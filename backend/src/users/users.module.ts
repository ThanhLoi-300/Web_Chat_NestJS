import { Module } from '@nestjs/common';
import { Services } from '../utils/constants';
import { UsersController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserProfilesController } from './controllers/user-profile.controller';
import { UserProfileService } from './services/user-profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/utils/typeorm';
import { UserSchema } from 'src/utils/typeorm/entities/User';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, UserProfilesController],
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
