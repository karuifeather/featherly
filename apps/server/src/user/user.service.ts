import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';

import { User as UserSchema, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserDocument>
  ) {}

  async create(createUserDto: CreateUserDto, req: Request) {
    const newUser = await this.userModel.create(createUserDto);

    const confirmationToken = newUser.createEmailConfirmToken();

    const confrimTokenUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/confirmEmail/${confirmationToken}`;

    // TODO: Send the email

    newUser.active = undefined; // Hide the  active field from the response

    // We just return the user; as AuthServie will handle the rest
    return newUser;
  }
}
