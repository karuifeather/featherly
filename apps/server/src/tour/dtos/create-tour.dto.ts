import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { StartLocationDto } from './start-location.dto';
import { LocationDto } from './locations.dto';

export class CreateTourDto {
  @ApiProperty({
    description: 'The name of the tour',
    example: 'Adventurous Safari',
    minLength: 10,
    maxLength: 40,
  })
  @IsString()
  @IsNotEmpty({ message: 'A tour must have a name' })
  @MinLength(10, {
    message: 'A tour name must have more than or equal to 10 characters',
  })
  @MaxLength(40, {
    message: 'A tour name must have less than or equal to 40 characters',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'The slug of the tour (URL-friendly name)',
    example: 'adventurous-safari',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    description: 'The starting location of the tour',
    type: StartLocationDto,
  })
  @IsOptional()
  startLocation?: StartLocationDto;

  @ApiPropertyOptional({
    description: 'The locations visited during the tour',
    type: [LocationDto],
  })
  @IsOptional()
  @IsArray()
  locations?: LocationDto[];
}
