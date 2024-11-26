import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  @ApiProperty({ example: 'success', description: 'Status of the response' })
  status: string;

  @ApiProperty({
    example: 'Your account has been created successfully',
    description: 'Message to the user',
  })
  message: string;
}
