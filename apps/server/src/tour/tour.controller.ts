import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TourService } from './tour.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateTourDto } from './dtos/create-tour.dto';
import { UpdateTourDto } from './dtos/update-tour.dto';
import { QueryToursDto } from './dtos/query-tour.dto';

@ApiTags('Tours') // Group all routes under "Tours" in Swagger
@Controller('tours')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @ApiOperation({ summary: 'Get statistics about tours (public)' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  @Get('tour-stats')
  getTourStats() {
    return this.tourService.getTourStats();
  }

  @ApiOperation({ summary: 'Get the top 5 cheapest tours (public)' })
  @ApiResponse({ status: 200, description: 'Top tours retrieved successfully' })
  @Get('top-5-cheap')
  aliasTopTours(@Query() query: QueryToursDto) {
    query.sort = '-price';
    query.limit = 5;
    return this.tourService.getAllTours(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get monthly plan for a specific year (protected)',
    description: 'Requires authentication and roles: admin, lead-guide, guide.',
  })
  @ApiParam({
    name: 'year',
    description: 'Year for the monthly plan',
    example: 2024,
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly plan retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Role not permitted' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'lead-guide', 'guide')
  @Get('monthly-plan/:year')
  getMonthlyPlan(@Param('year') year: number) {
    return this.tourService.getMonthlyPlan(year);
  }

  @ApiOperation({ summary: 'Get tours within a specified distance (public)' })
  @ApiParam({ name: 'distance', description: 'Distance radius', example: 50 })
  @ApiParam({
    name: 'latlng',
    description: 'Latitude and longitude (comma-separated)',
    example: '34.111745,-118.113491',
  })
  @ApiParam({
    name: 'unit',
    description: 'Distance unit (mi or km)',
    example: 'mi',
  })
  @ApiResponse({
    status: 200,
    description: 'Tours within distance retrieved successfully',
  })
  @Get('tours-within/:distance/center/:latlng/unit/:unit')
  getToursWithin(
    @Param('distance') distance: number,
    @Param('latlng') latlng: string,
    @Param('unit') unit: string
  ) {
    return this.tourService.getToursWithin(distance, latlng, unit);
  }

  @ApiOperation({
    summary: 'Get distances from a starting point to all tours (public)',
  })
  @ApiParam({
    name: 'latlng',
    description: 'Latitude and longitude (comma-separated)',
    example: '34.111745,-118.113491',
  })
  @ApiParam({
    name: 'unit',
    description: 'Distance unit (mi or km)',
    example: 'mi',
  })
  @ApiResponse({ status: 200, description: 'Distances retrieved successfully' })
  @Get('distances/:latlng/unit/:unit')
  getDistances(@Param('latlng') latlng: string, @Param('unit') unit: string) {
    return this.tourService.getDistances(latlng, unit);
  }

  @ApiOperation({ summary: 'Get all tours (public)' })
  @ApiResponse({ status: 200, description: 'Tours retrieved successfully' })
  @Get()
  getAllTours(@Query() query: QueryToursDto) {
    return this.tourService.getAllTours(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new tour (protected)',
    description: 'Requires authentication and roles: admin, lead-guide.',
  })
  @ApiResponse({ status: 201, description: 'Tour created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Role not permitted' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'lead-guide')
  @Post()
  createTour(@Body() body: CreateTourDto) {
    return this.tourService.createTour(body);
  }

  @ApiOperation({ summary: 'Get a single tour by ID (public)' })
  @ApiParam({
    name: 'id',
    description: 'Tour ID',
    example: '5c88fa8cf4afda39709c295a',
  })
  @ApiResponse({ status: 200, description: 'Tour retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  @Get(':id')
  getTour(@Param('id') id: string) {
    return this.tourService.getTour(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a tour by ID (protected)',
    description: 'Requires authentication and roles: admin, lead-guide.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tour ID',
    example: '5c88fa8cf4afda39709c295a',
  })
  @ApiResponse({ status: 200, description: 'Tour updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Role not permitted' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'lead-guide')
  @Patch(':id')
  updateTour(@Param('id') id: string, @Body() body: UpdateTourDto) {
    return this.tourService.updateTour(id, body);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a tour by ID (protected)',
    description: 'Requires authentication and roles: admin, lead-guide.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tour ID',
    example: '5c88fa8cf4afda39709c295a',
  })
  @ApiResponse({ status: 204, description: 'Tour deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Role not permitted' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'lead-guide')
  @Delete(':id')
  deleteTour(@Param('id') id: string) {
    return this.tourService.deleteTour(id);
  }
}
