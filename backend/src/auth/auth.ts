import { User } from "src/utils/typeorm";
import { ValidateUserDetails } from "src/utils/types";

export interface IAuthService{
    validateUser(userCredential: ValidateUserDetails): Promise<User | null>
    validateToken(token: string): Promise<any>
}