import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class BaseQueryDto {
  @ApiPropertyOptional({
    description: 'Sort criteria for the query (e.g., "-field1,field2").',
    example: '-createdAt',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description:
      'Comma-separated fields to select in the response (e.g., "field1,field2").',
    example: 'name,price,ratingsAverage',
  })
  @IsOptional()
  @IsString()
  fields?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return per page.',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10)) // Transform query string to number
  limit?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10)) // Transform query string to number
  page?: number;

  @ApiPropertyOptional({
    description:
      'Dynamic filters for entity-specific fields. For example: {"field1": "value", "field2[gte]": 100}.',
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { difficulty: 'easy', 'price[gte]': 500 },
  })
  @IsOptional()
  @Type(() => Object)
  filters?: Record<string, string | number>;

  @ApiPropertyOptional({
    description: 'Keyword for full-text search across indexed fields.',
    example: 'mountain',
  })
  @IsOptional()
  @IsString()
  keyword?: string; // for search
}
