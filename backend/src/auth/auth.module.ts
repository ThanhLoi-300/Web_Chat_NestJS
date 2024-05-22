import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { Services } from 'src/utils/constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SessionManager } from './Session';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/utils/typeorm/entities/User';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    JwtModule.register({
      secret: 'helloworld',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
    {
      provide: Services.PUSHER_SESSION,
      useClass: SessionManager,
    },
  ],
  exports: [
    {
      provide: Services.PUSHER_SESSION,
      useClass: SessionManager,
    },
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
