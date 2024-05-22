import { Injectable } from '@nestjs/common';
import { User } from 'src/utils/typeorm';

export interface ISessionManager {
  getUserPusher(id: string): User;
  setUserPusher(user: User): void;
  removeUserPusher(id: string): void;
  getPushers(): Map<string, User>;
}

@Injectable()
export class SessionManager implements ISessionManager {
  private readonly sessions: Map<string, User> = new Map();

  getUserPusher(id: string) {
    return this.sessions.get(id);
  }

  setUserPusher(user: User) {
    this.sessions.set(user.id, user);
  }
  removeUserPusher(userId: string) {
    this.sessions.delete(userId);
  }
  getPushers(): Map<string, User> {
    return this.sessions;
  }
}