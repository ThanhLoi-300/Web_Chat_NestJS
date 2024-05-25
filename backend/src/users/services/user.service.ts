import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hashPassword } from 'src/utils/helpers';
import { User } from 'src/utils/typeorm';
import { CreateFriendParams, CreateUserDetails, FindUserParams, UserParams } from 'src/utils/types';
import { IUserService } from '../interfaces/user';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserProfileDto } from '../dtos/UpdateUserProfile.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async saveUser(user: UserParams): Promise<User> {
    const { id, ...userDetail } = user;
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userDetail, {
      new: true,
    });

    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return updatedUser;
  }

  async searchUsers(query: string, user: UserParams): Promise<User[]> {
    const users = await this.userModel.find({
      $and: [
        {
          $or: [
            { email: { $regex: new RegExp(`.*${query}.*`, 'i') } },
            { name: { $regex: new RegExp(`.*${query}.*`, 'i') } },
          ],
        },
        { _id: { $ne: user.id! } },
      ],
    });

    return users;
  }

  async createUser(userDetails: CreateUserDetails) {
    const existingUser = await this.userModel.findOne({
      email: userDetails.email,
    });

    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    const password = await hashPassword(userDetails.password);
    const newUser = new this.userModel({
      ...userDetails,
      password,
      banner: '',
      avatar: ''
    });
    return await newUser.save();
  }

  async findUser(params: FindUserParams): Promise<User> {
    return await this.userModel.findOne({ ...params });
  }

  async createProfileOrUpdate(userId: string, params: UpdateUserProfileDto) {
    const user = await this.findUser({ _id: userId });
    if (user) {
      params.banner && (user.banner = params.banner);
      params.avatar && (user.avatar = params.avatar);
      user.name = params.name;
      const saved = await user.save();
      return await this.userModel.findById(saved._id);
    }
    return user;
  }
}
