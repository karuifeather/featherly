import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class QueryBookingDto {
  @ApiPropertyOptional({
    description: 'Filter bookings by tour ID',
    example: '64123f45c5e342001da563b1',
  })
  @IsString()
  @IsOptional()
  tour?: string;

  @ApiPropertyOptional({
    description: 'Filter bookings by user ID',
    example: '64123f45c5e342001da563b0',
  })
  @IsString()
  @IsOptional()
  user?: string;

  @ApiPropertyOptional({
    description: 'Filter by whether the booking has been paid',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @ApiPropertyOptional({
    description: 'Number of results to return per page',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Sort by fields (e.g., "-price" for descending)',
    example: '-price',
  })
  @IsString()
  @IsOptional()
  sort?: string;
}
