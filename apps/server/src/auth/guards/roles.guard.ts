// src/auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { JwtAuthGuard } from './auth.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserService } from '../../user/user.service';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    jwtService: JwtService,
    configService: ConfigService,
    userService: UserService
  ) {
    super(jwtService, configService, userService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler()
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!requiredRoles.some((role) => user.roles?.includes(role))) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.'
      );
    }

    return true;
  }
}
