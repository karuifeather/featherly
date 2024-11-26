import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsMongoId,
} from 'class-validator';
import { Schema } from 'mongoose';

export class CreateBookingDto {
  @ApiProperty({
    description: 'The ID of the tour being booked',
    example: '64123f45c5e342001da563b1',
  })
  @IsMongoId()
  @IsNotEmpty()
  tour: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'The ID of the user making the booking',
    example: '64123f45c5e342001da563b0',
  })
  @IsMongoId()
  @IsNotEmpty()
  user: Schema.Types.ObjectId;

  @ApiProperty({
    description: 'The price of the booking',
    example: 299.99,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Indicates if the booking has been paid',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  paid?: boolean;
}
