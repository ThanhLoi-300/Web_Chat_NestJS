import { Injectable } from '@nestjs/common';
import { User } from 'src/utils/typeorm';

export interface ISessionManager {
  getUserPusher(id: number): User;
  setUserPusher(user: User): void;
  removeUserPusher(id: number): void;
  getPushers(): Map<number, User>;
}

@Injectable()
export class SessionManager implements ISessionManager {
  private readonly sessions: Map<number, User> = new Map();

  getUserPusher(id: number) {
    return this.sessions.get(id);
  }

  setUserPusher(user: User) {
    this.sessions.set(user.id, user);
  }
  removeUserPusher(userId: number) {
    this.sessions.delete(userId);
  }
  getPushers(): Map<number, User> {
    return this.sessions;
  }
}