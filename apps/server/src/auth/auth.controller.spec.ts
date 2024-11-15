import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserDocument } from '../user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            confirmEmail: jest.fn(),
            login: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: jest.fn(() => true), // Mock the guard to always allow access
          },
        },
        {
          provide: RolesGuard,
          useValue: {
            canActivate: jest.fn(() => true), // Mock the guard to always allow access
          },
        },
        {
          provide: UserService, // Add UserService mock
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call AuthService.signup on /signup', async () => {
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const createUserDto = {
      fname: 'Test',
      lname: 'User',
      email: 'test@example.com',
      password: 'password123',
    };

    jest.spyOn(authService, 'signup').mockResolvedValue({
      status: 'success',
      token: 'mocked-jwt-token',
      data: { user: { email: 'test@example.com' } as unknown as UserDocument },
    });

    await authController.signUp(createUserDto, mockRequest, mockResponse);

    expect(authService.signup).toHaveBeenCalledWith(
      createUserDto,
      mockRequest,
      mockResponse
    );
  });
});
