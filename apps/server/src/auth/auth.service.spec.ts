import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDocument } from '../user/schemas/user.schema';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(() => 'test-jwt-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_PRIVATE') return 'secret-key';
              if (key === 'JWT_EXPIRES_IN') return '1h';
              if (key === 'JWT_COOKIE_EXPIRES_IN') return '7'; // 7 days
            }),
          },
        },
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('signup', () => {
    it('should create a new user and return a response with JWT token', async () => {
      const createUserDto: CreateUserDto = {
        email: 'snow@winterfell.com',
        password: 'aegontarygaryen',
        fname: 'Jon',
        lname: 'Snow',
      };

      const req = {
        secure: true,
        headers: { 'x-forwarded-proto': 'https' },
      } as unknown as Request;

      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const newUser = {
        id: 'user123',
        email: createUserDto.email,
        fname: createUserDto.fname,
        lname: createUserDto.lname,
        password: undefined, // Password should be undefined in the response
      };

      jest
        .spyOn(userService, 'create')
        .mockResolvedValue(newUser as unknown as UserDocument);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('test-jwt-token');

      await authService.signup(createUserDto, req, res);

      // Assertions
      expect(userService.create).toHaveBeenCalledWith(createUserDto, req);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: 'user123' },
        {
          secret: 'secret-key',
          expiresIn: '1h',
        }
      );
      expect(res.cookie).toHaveBeenCalledWith('jwt', 'test-jwt-token', {
        expires: expect.any(Date),
        httpOnly: true,
        secure: true,
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        token: 'test-jwt-token',
        data: {
          user: newUser,
        },
      });
    });
  });

  describe('confirmEmail', () => {
    it('should return a test response', () => {
      expect(authService.confirmEmail()).toBe(
        'this is a test response from auth controller'
      );
    });
  });

  describe('login', () => {
    it('should return a test response', () => {
      expect(authService.login()).toBe(
        'this is a test response from auth controller'
      );
    });
  });

  describe('forgotPassword', () => {
    it('should return a test response', () => {
      expect(authService.forgotPassword()).toBe(
        'this is a test response from auth controller'
      );
    });
  });

  describe('resetPassword', () => {
    it('should return a test response', () => {
      expect(authService.resetPassword()).toBe(
        'this is a test response from auth controller'
      );
    });
  });
});
