import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class QueryReviewsDto {
  @IsOptional()
  @IsString()
  sort?: string; // e.g., '-rating,createdAt'

  @IsOptional()
  @IsString()
  fields?: string; // e.g., 'review,rating'

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number; // Filter by specific rating
}
