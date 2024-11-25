import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

import { LoginAuthDto } from './dtos/login-dto';
import { AuthResponseDto } from './dtos/response/auth-response.dto';
import { LogoutResponseDto } from './dtos/response/logout-response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered and authenticated.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.authService.signup(createUserDto, req, res);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiResponse({
    status: 201,
    description: 'Authentication successful.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Missing email or password.',
  })
  @ApiResponse({
    status: 401,
    description: 'Incorrect email or password.',
  })
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.authService.login(loginAuthDto, req, res);
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Log out the user' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful.',
    type: LogoutResponseDto,
  })
  async logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }

  @Get('confirmEmail/:token')
  confirmEmail() {
    return this.authService.confirmEmail();
  }

  @Post('/forgotPassword')
  forgotPassword() {
    return this.authService.forgotPassword();
  }

  @Patch('/resetPassword/:token')
  resetPassword() {
    return this.authService.resetPassword();
  }
}
