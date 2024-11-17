import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  IsEnum,
  MaxLength,
  MinLength,
  Min,
  Max,
} from 'class-validator';

export class CreateTourDto {
  @IsString()
  @IsNotEmpty({ message: 'A tour must have a name' })
  @MinLength(10, {
    message: 'A tour name must have more than or equal to 10 characters',
  })
  @MaxLength(40, {
    message: 'A tour name must have less than or equal to 40 characters',
  })
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'A tour must have a duration' })
  duration: number;

  @IsNumber()
  @IsNotEmpty({ message: 'A tour must have a group size' })
  maxGroupSize: number;

  @IsString()
  @IsNotEmpty({ message: 'A tour must have a difficulty' })
  @IsEnum(['easy', 'medium', 'difficult'], {
    message: "Difficulty can only be 'easy', 'medium' or 'difficult'",
  })
  difficulty: string;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Rating must be above 1.0' })
  @Max(5, { message: 'Rating must be below 5.0' })
  ratingsAverage?: number;

  @IsNumber()
  @IsOptional()
  ratingsQuantity?: number;

  @IsNumber()
  @IsNotEmpty({ message: 'A tour must have a price' })
  price: number;

  @IsNumber()
  @IsOptional()
  priceDiscount?: number;

  @IsString()
  @IsNotEmpty({ message: 'A tour must have a summary' })
  summary: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'A tour must have a cover image' })
  imageCover: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  startDates?: Date[];

  @IsBoolean()
  @IsOptional()
  secretTour?: boolean;

  @IsOptional()
  startLocation?: {
    type: string;
    coordinates: [number, number];
    address: string;
    description: string;
  };

  @IsOptional()
  locations?: {
    type: string;
    coordinates: [number, number];
    address: string;
    description: string;
    day: number;
  }[];

  @IsArray()
  @IsOptional()
  guides?: string[];
}
