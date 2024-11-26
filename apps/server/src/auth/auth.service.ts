import {
  Injectable,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginAuthDto } from './dtos/login-dto';
import { UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly userService: UserService
  ) {}

  private async signToken(id: string): Promise<string> {
    return await this.jwtService.signAsync(
      { id },
      {
        secret: this.configService.get<string>('JWT_PRIVATE'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      }
    );
  }

  private async sendAuthResponse(
    user: UserDocument,
    token: string,
    req: Request,
    res: Response
  ) {
    // Remove password from the User object
    user.password = undefined;

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

    const responseBody = {
      status: 'success',
      token,
      data: {
        user,
      },
    };

    res.status(HttpStatus.CREATED).json(responseBody);

    // for testing purposes
    return responseBody;
  }

  async signup(createUserDto: CreateUserDto, req: Request, res: Response) {
    const newUser = await this.userService.create(createUserDto, req);

    const token = await this.signToken(newUser.id);

    return this.sendAuthResponse(newUser, token, req, res);
  }

  async login(loginAuthDto: LoginAuthDto, req: Request, res: Response) {
    const { email, password } = loginAuthDto;

    // 1 If email and password don't exist
    if (!email || !password) {
      throw new BadRequestException('Please provide email and password');
    }

    // 2 If email user exists && password is correct
    // + is needed because select in password is set to false. See user model.
    const user = await this.userService.findUserByEmail(email, '+password');

    // Check if user exists
    if (!user) {
      throw new NotFoundException('User does not exist. Please sign up!');
    }

    // Check if password is correct
    if (!(await user.isPasswordCorrect(password))) {
      throw new UnauthorizedException('Incorrect email or password!');
    }

    const token = await this.signToken(user.id);

    return this.sendAuthResponse(user, token, req, res);
  }

  logout(req: Request, res: Response) {
    const cookieOptions = {
      expires: new Date(Date.now() + 2 * 1000),
      httpOnly: true,
    };

    res.cookie('jwt', 'loggedout', cookieOptions);

    res.status(200).json({
      status: 'success',
    });
  }

  confirmEmail() {
    return 'this is a test response from auth controller';
  }

  forgotPassword() {
    return 'this is a test response from auth controller';
  }

  resetPassword() {
    return 'this is a test response from auth controller';
  }
}
