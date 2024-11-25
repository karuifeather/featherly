import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user.',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  fname: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user.',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  lname: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the user.',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
