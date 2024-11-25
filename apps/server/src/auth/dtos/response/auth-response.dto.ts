import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 'success', description: 'Status of the response' })
  status: string;

  @ApiProperty({
    example: 'jwt.token.here',
    description: 'JWT authentication token',
  })
  token: string;

  @ApiProperty({
    description: 'Authenticated user details',
    type: () => UserDto,
  })
  data: {
    user: UserDto;
  };
}

export class UserDto {
  @ApiProperty({ example: '123456', description: 'Unique user ID' })
  id: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  fname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  lname: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  email: string;
}
