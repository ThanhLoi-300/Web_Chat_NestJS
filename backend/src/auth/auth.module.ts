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

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  ]
})
export class AuthModule {}
