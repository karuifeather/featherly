import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsMongoId,
  Min,
  Max,
} from 'class-validator';

export class QueryReviewsDto {
  @ApiPropertyOptional({
    description: 'Sort criteria for the reviews (e.g., "-rating,createdAt").',
    example: '-rating,createdAt',
  })
  @IsOptional()
  @IsString()
  sort?: string; // e.g., '-rating,createdAt'

  @ApiPropertyOptional({
    description:
      'Comma-separated list of fields to select in the response (e.g., "review,rating").',
    example: 'review,rating',
  })
  @IsOptional()
  @IsString()
  fields?: string; // e.g., 'review,rating'

  @ApiPropertyOptional({
    description: 'Maximum number of results to return per page.',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Filter reviews by specific rating (1 to 5).',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Filter reviews for a specific tour by tour ID.',
    example: '64123f45c5e342001da563b1',
  })
  @IsOptional()
  @IsMongoId()
  tourId?: string;

  @ApiPropertyOptional({
    description: 'Filter reviews for a specific user by user ID.',
    example: '64123f45c5e342001da563b0',
  })
  @IsOptional()
  @IsMongoId()
  userId?: string;
}
