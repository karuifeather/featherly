import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class QueryToursDto {
  @ApiPropertyOptional({
    description: 'Sort criteria for the query (e.g., "-ratingsAverage,price").',
    example: '-ratingsAverage,price',
  })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    description:
      'Comma-separated fields to select in the response (e.g., "name,price,ratingsAverage").',
    example: 'name,price,ratingsAverage',
  })
  @IsString()
  @IsOptional()
  fields?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return.',
    example: 10,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description:
      'Dynamic filters for the query. For example: "difficulty=easy" or "price[gte]=500".',
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { difficulty: 'easy', 'price[gte]': '500' },
  })
  @IsOptional()
  filters?: Record<string, string | number>;
}
