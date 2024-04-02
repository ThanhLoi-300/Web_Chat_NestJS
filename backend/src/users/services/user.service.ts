import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils/helpers';
import { User } from 'src/utils/typeorm';
import { CreateUserDetails, FindUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { IUserService } from '../interfaces/user';

@Injectable()
export class UserService implements IUserService{
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }
    
    saveUser(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    searchUsers(query: string, user: User): Promise<User[]> {
        const statement = '((user.name LIKE :query OR user.email LIKE :query) AND user.id != :userId)';
        return this.userRepository
        .createQueryBuilder('user')
        .where(statement, { query: `%${query}%`, userId: user.id })
        .limit(10)
        .select([
            'user.name',
            'user.email',
            'user.id',
            'user.profile',
        ])
        .getMany();
    }
    
    async createUser(userDetails: CreateUserDetails) {
        const existingUser = await this.userRepository.findOne({
            email: userDetails.email
        })

        if(existingUser) throw new HttpException('User already exists', HttpStatus.CONFLICT)
        const password = await hashPassword(userDetails.password)
        const newUser = this.userRepository.create({ ...userDetails, password })
        return this.userRepository.save(newUser)
    }

    async findUser(findUserParams: FindUserParams): Promise<User>{
        return this.userRepository.findOne(findUserParams)
    }
    
}
