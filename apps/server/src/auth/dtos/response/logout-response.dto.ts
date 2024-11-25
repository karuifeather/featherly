import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ example: 'success', description: 'Status of the response' })
  status: string;
}
