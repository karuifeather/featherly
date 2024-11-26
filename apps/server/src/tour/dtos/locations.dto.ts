import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({ example: 'Point', description: 'The type of the location' })
  type: string;

  @ApiProperty({
    example: [-118.113491, 34.111745],
    description: 'Coordinates of the location',
    type: [Number],
  })
  coordinates: [number, number];

  @ApiProperty({
    example: '123 Tour Street, Adventure City, USA',
    description: 'The address of the location',
  })
  address: string;

  @ApiProperty({
    example: 'Detailed location description',
    description: 'A description of the location',
  })
  description: string;

  @ApiProperty({
    example: 1,
    description: 'The day of the tour for this location',
  })
  day: number;
}
