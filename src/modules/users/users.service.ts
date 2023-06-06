import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { IAppConfig } from 'config/app.config';
import { IMongoConfig } from 'config/mongo.config';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService<
      IAppConfig & IMongoConfig,
      true
    >,
    @InjectModel(User.name) private readonly mongooseModel: Model<User>,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    {
      try {
        const newUser = new this.mongooseModel(user);
        return await newUser.save();
      } catch (error) {
        if (error.code === 11000) {
          throw new UnprocessableEntityException(
            `User with email ${user.email} already exists`,
          );
        }
      }
    }
  }

  private buildQuery(queryUserDto: QueryUserDto) {
    const query = this.getModel().find({
      $nor: [{ isDeleted: true }],
    });

    const queryFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'birthDate',
      'marketingSource',
      'status',
      'createdAt',
      'updatedAt',
    ];

    for (const field of queryFields) {
      const value = queryUserDto[field];
      if (value) {
        query.where(field).equals(value);
      }
    }
    return query;
  }

  async getUsers(queryUserDto: QueryUserDto): Promise<User[]> {
    const query = this.buildQuery(queryUserDto);
    const { limit, page, sort, sortBy } = queryUserDto;
    return await query
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: sort })
      .exec();
  }

  getModel(): Model<User> {
    return this.mongooseModel;
  }
}
