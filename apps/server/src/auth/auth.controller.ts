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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.authService.signup(createUserDto, req, res);
  }

  @Get('admin-dashboard')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('confirmEmail/:token')
  confirmEmail() {
    return this.authService.confirmEmail();
  }

  @Post('/login')
  login() {
    return this.authService.login();
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
