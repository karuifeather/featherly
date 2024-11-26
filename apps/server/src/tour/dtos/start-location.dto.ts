import { ApiProperty } from '@nestjs/swagger';

export class StartLocationDto {
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
    example: 'Starting point of the tour',
    description: 'A description of the location',
  })
  description: string;
}
