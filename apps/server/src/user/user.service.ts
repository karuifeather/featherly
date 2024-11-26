import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from '../shared/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private emailService: EmailService
  ) {}

  async create(
    createUserDto: CreateUserDto,
    req: Request
  ): Promise<UserDocument> {
    try {
      const newUser = await this.userModel.create(createUserDto);
      const confirmationToken = newUser.createEmailConfirmToken();
      await newUser.save({ validateBeforeSave: false });

      const confrimTokenUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/auth/confirmEmail/${confirmationToken}`;

      await this.emailService.sendConfirmEmail(
        {
          name: newUser.fname,
          email: newUser.email,
        },
        confrimTokenUrl
      );

      newUser.active = undefined; // Hide the  active field from the response

      // We just return the user; as AuthServie will handle the rest
      return newUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Email already exists. Please use a different email.'
        );
      }
      throw error;
    }
  }

  async findUserByToken(token: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ accountConfirmToken: token })
      .setOptions({ skipActiveFilter: true });
  }

  async findUserByEmail(email: string, select = '') {
    return this.userModel.findOne({ email }).select(select);
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }
}
