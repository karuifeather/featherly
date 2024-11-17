import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { Schema } from 'mongoose';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'A review cannot be empty.' })
  review: string;

  @IsNumber()
  @IsNotEmpty({ message: 'A review must have a rating.' })
  @Min(1, { message: 'A review cannot have a rating below 1.' })
  @Max(5, { message: 'A review cannot have a rating above 5.' })
  rating: number;

  @IsNotEmpty({ message: 'Review must belong to a tour.' })
  tour: Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Review must belong to a user.' })
  user: Schema.Types.ObjectId;
}
