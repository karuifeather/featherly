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

  @Post('/login')
  login(
    @Body() loginAuthDto: LoginAuthDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.authService.login(loginAuthDto, req, res);
  }

  @Post('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
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
