import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    // Check if the valid token exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      //
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new UnauthorizedException('You are not logged in. Please log in!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_PRIVATE'),
      });

      // Find user by ID from payload
      const currentUser = await this.userService.findById(payload.id);

      if (!currentUser) {
        throw new UnauthorizedException(
          'The user who owns the token no longer exists!'
        );
      }

      // Check if the user changed their password after the token was issued
      if (currentUser.hasPasswordChangedAfterTokenIssued(payload.iat)) {
        throw new UnauthorizedException(
          'Your password was changed recently. Log in with the new password and try again.'
        );
      }

      // Grant access to the protected route
      req['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
