import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Schema } from 'mongoose';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The content of the review.',
    example: 'This tour was amazing! Highly recommend.',
  })
  @IsString()
  @IsNotEmpty({ message: 'A review cannot be empty.' })
  review: string;

  @ApiProperty({
    description: 'The rating of the tour, from 1 to 5.',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'A review must have a rating.' })
  @Min(1, { message: 'A review cannot have a rating below 1.' })
  @Max(5, { message: 'A review cannot have a rating above 5.' })
  rating: number;

  @ApiProperty({
    description: 'The ID of the tour being reviewed.',
    example: '64123f45c5e342001da563b1',
  })
  @IsMongoId({ message: 'Tour ID must be a valid MongoDB ObjectId.' })
  @IsNotEmpty({ message: 'Review must belong to a tour.' })
  tour: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'The ID of the user submitting the review.',
    example: '64123f45c5e342001da563b0',
  })
  @IsMongoId({ message: 'User ID must be a valid MongoDB ObjectId.' })
  @IsNotEmpty({ message: 'Review must belong to a user.' })
  user: Schema.Types.ObjectId;
}
