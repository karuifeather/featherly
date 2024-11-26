import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { QueryReviewsDto } from './dtos/query-review.dto';

@ApiTags('Reviews') // Group all routes under "Reviews" in Swagger
@ApiBearerAuth() // Indicate all routes require authentication
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewsService: ReviewService) {}

  @ApiOperation({
    summary: 'Get all reviews or reviews for a specific tour.',
    description: 'Fetch all reviews or reviews filtered by a specific tour ID.',
  })
  @ApiQuery({
    name: 'tourId',
    required: false,
    description: 'Filter reviews by tour ID',
    example: '64123f45c5e342001da563b1',
  })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully.',
  })
  @Get('')
  async getAllReviews(@Query() queryParams: QueryReviewsDto) {
    return this.reviewsService.getAllReviews(queryParams);
  }

  @ApiOperation({
    summary: 'Create a new review for a tour.',
    description: 'Allows a user to create a review for a specific tour.',
  })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Role not permitted.',
  })
  @Roles('user') // Restrict to users
  @UseGuards(RolesGuard)
  @Post()
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(createReviewDto);
  }

  @ApiOperation({
    summary: 'Get a specific review by its ID.',
    description: 'Retrieve a single review by its unique ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the review to retrieve.',
    example: '64123f45c5e342001da563b2',
  })
  @ApiResponse({
    status: 200,
    description: 'Review retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found.',
  })
  @Get('/:id')
  async getReview(@Param('id') id: string) {
    return this.reviewsService.getReview(id);
  }

  @ApiOperation({
    summary: 'Update a review by its ID.',
    description: 'Allows users or admins to update an existing review.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the review to update.',
    example: '64123f45c5e342001da563b2',
  })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Role not permitted.',
  })
  @Roles('user', 'admin') // Restrict to users and admins
  @UseGuards(RolesGuard)
  @Patch('/:id')
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    return this.reviewsService.updateReview(id, updateReviewDto);
  }

  @ApiOperation({
    summary: 'Delete a review by its ID.',
    description: 'Allows users or admins to delete an existing review.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the review to delete.',
    example: '64123f45c5e342001da563b2',
  })
  @ApiResponse({
    status: 204,
    description: 'Review deleted successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Role not permitted.',
  })
  @Roles('user', 'admin') // Restrict to users and admins
  @UseGuards(RolesGuard)
  @Delete('/:id')
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
