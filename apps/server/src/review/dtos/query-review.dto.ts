import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsMongoId, Min, Max } from 'class-validator';
import { BaseQueryDto } from '../../shared/query.dto';

export class QueryReviewsDto extends BaseQueryDto {
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
