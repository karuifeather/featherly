import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService
  ) {}

  private signToken(id: string): string {
    return this.jwtService.sign(
      { id },
      {
        secret: this.configService.get<string>('JWT_PRIVATE'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      }
    );
  }

  async signup(createUserDto: CreateUserDto, req: Request, res: Response) {
    const newUser = await this.userService.create(createUserDto, req);

    const token = this.signToken(newUser.id);

    // Remove password from the newUser object
    newUser.password = undefined;

    // Set cookie for JWT token
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() +
          +this.configService.get<string>('JWT_COOKIE_EXPIRES_IN') *
            24 *
            60 *
            60 *
            1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });

    return res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }

  confirmEmail() {
    return 'this is a test response from auth controller';
  }

  login() {
    return 'this is a test response from auth controller';
  }

  forgotPassword() {
    return 'this is a test response from auth controller';
  }

  resetPassword() {
    return 'this is a test response from auth controller';
  }
}
