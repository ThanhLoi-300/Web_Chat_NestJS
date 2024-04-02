import { User } from '../../utils/typeorm';

export interface IUserProfile {
  createProfile();
  createProfileOrUpdate(user: User, params: any);
}