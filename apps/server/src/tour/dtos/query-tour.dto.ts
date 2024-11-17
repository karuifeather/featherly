import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class QueryToursDto {
  @IsString()
  @IsOptional()
  sort?: string; // e.g., '-ratingsAverage,price'

  @IsString()
  @IsOptional()
  fields?: string; // e.g., 'name,price,ratingsAverage'

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  [key: string]: string | number; // For custom filters like "difficulty=easy" or "price[gte]=500"
}
