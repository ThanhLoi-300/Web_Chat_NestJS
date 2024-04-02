import { User } from "src/utils/typeorm";
import { CreateUserDetails, FindUserParams } from "src/utils/types";

export interface IUserService{
    createUser(userDetails: CreateUserDetails): Promise<User>
    findUser(findUserParams: FindUserParams): Promise<User>
    saveUser(user: User): Promise<User>
    searchUsers(query: string, user: User): Promise<User[]>
}