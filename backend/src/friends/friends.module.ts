import { Module } from '@nestjs/common';
import { Services } from '../utils/constants';
import { Friend, FriendRequest } from '../utils/typeorm';
import { FriendsController } from './friends.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendSchema } from 'src/utils/typeorm/entities/Friend';
import { FriendsService } from './friends.service';
import { UsersModule } from 'src/users/users.module';
import { FriendRequestSchema } from 'src/utils/typeorm/entities/FriendRequest';
import { SocketService } from 'src/utils/SocketService';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Friend.name, schema: FriendSchema },
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
    UsersModule,
  ],
  providers: [
    {
      provide: Services.FRIENDS_SERVICE,
      useClass: FriendsService,
    },
    SocketService,
  ],
  controllers: [FriendsController],
  exports: [
    {
      provide: Services.FRIENDS_SERVICE,
      useClass: FriendsService,
    },
  ],
})
export class FriendsModule {}
