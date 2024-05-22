import { User } from "src/utils/typeorm";
import { CreateFriendParams, CreateUserDetails, FindUserParams, UserParams } from "src/utils/types";

export interface IUserService {
  createUser(userDetails: CreateUserDetails): Promise<User>;
  findUser(findUserParams: FindUserParams): Promise<User>;
  saveUser(user: UserParams): Promise<User>;
  searchUsers(query: string, user: UserParams): Promise<User[]>;
}