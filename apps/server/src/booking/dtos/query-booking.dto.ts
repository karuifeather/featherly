import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from '../../shared/query.dto';

export class QueryBookingDto extends BaseQueryDto {
  @ApiPropertyOptional({
    description: 'Filter bookings by tour ID.',
    example: '64123f45c5e342001da563b1',
  })
  tour?: string;

  @ApiPropertyOptional({
    description: 'Filter bookings by user ID.',
    example: '64123f45c5e342001da563b0',
  })
  user?: string;

  @ApiPropertyOptional({
    description: 'Filter bookings by payment status.',
    example: true,
  })
  paid?: boolean;
}
