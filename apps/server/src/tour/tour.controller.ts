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
  ApiBearerAuth,
  ApiQuery,
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

  @ApiOperation({ summary: 'Get the top 5 popular tours (public)' })
  @ApiResponse({
    status: 200,
    description: 'Top popular tours retrieved successfully',
  })
  @Get('popular')
  aliasTopPopularTours(@Query() query: QueryToursDto) {
    query.sort = '-ratingsAverage,-ratingsQuantity';
    query.limit = 6;
    query.fields =
      'name,price,ratingsAverage,ratingsQuantity,summary,imageCover,slug';
    return this.tourService.getAllTours(query);
  }

  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get recommended tours for the authenticated user',
    description: `
    This endpoint retrieves a personalized list of recommended tours for the authenticated user. 
    The recommendations are based on user preferences, popularity (ratings and reviews), and other criteria.
    The response includes essential tour details such as name, price, ratings, and a brief summary.
    `,
  })
  @ApiQuery({
    name: 'userId',
    type: String,
    description:
      'The ID of the user for whom recommendations are to be fetched',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the recommended tours.',
    schema: {
      example: [
        {
          name: 'Northern Lights Expedition',
          price: 799,
          ratingsAverage: 4.9,
          ratingsQuantity: 25,
          summary: 'Witness the magical auroras in the Arctic skies.',
          imageCover: 'https://cloudinary.com/example.jpg',
          slug: 'northern-lights-expedition',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. The user must be authenticated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Missing or invalid query parameters.',
  })
  async getRecommendedTours(
    @Query() query: QueryToursDto,
    @Query('userId') userId: string
  ) {
    query.sort = '-ratingsAverage,-ratingsQuantity';
    query.limit = 6;
    query.fields =
      'name,price,ratingsAverage,ratingsQuantity,summary,imageCover,slug';

    return this.tourService.getRecommendedTours(userId, query);
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
  @ApiResponse({ status: 200, description: 'Tours retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters.' })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Search keyword for full-text search across indexed fields.',
    example: 'mountain',
  })
  @ApiQuery({
    name: 'filters',
    required: false,
    description: `Filter tours by fields. Example: { "price[gte]": 100, "ratingsAverage[gte]": 4.5 }`,
    type: Object,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description:
      'Sort tours by fields. Use "-" for descending order (e.g., "-price").',
    example: '-createdAt',
  })
  @ApiQuery({
    name: 'fields',
    required: false,
    description:
      'Comma-separated list of fields to include in the response (e.g., "name,price").',
    example: 'name,price,ratingsAverage',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of results per page.',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination.',
    example: 1,
  })
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
  @Get('by-id/:id')
  getTour(@Param('id') id: string) {
    return this.tourService.getTour(id);
  }

  @ApiOperation({ summary: 'Get a single tour by slug (public)' })
  @ApiParam({
    name: 'slug',
    description: 'Tour slug',
    example: 'northern-lights-expedition',
  })
  @ApiResponse({ status: 200, description: 'Tour retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tour not found' })
  @Get('by-slug/:slug')
  getTourBySlug(@Param('slug') slug: string) {
    return this.tourService.getTourBySlug(slug);
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
