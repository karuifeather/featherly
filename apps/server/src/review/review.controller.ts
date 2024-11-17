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
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewsService: ReviewService) {}

  // GET /tours/:tourId/reviews or GET /reviews
  @Get()
  async getAllReviews(
    @Query('tourId') tourId: string,
    @Query() queryParams: any
  ) {
    return this.reviewsService.getAllReviews(tourId, queryParams);
  }

  // POST /tours/:tourId/reviews
  @Post()
  @Roles('user')
  @UseGuards(RolesGuard)
  async createReview(
    @Body() createReviewDto: any,
    @Req() req: any // Get user from request
  ) {
    const { tourId } = req.params;
    const userId = req.user.id;
    return this.reviewsService.createReview({
      tourId,
      userId,
      ...createReviewDto,
    });
  }

  // GET /reviews/:id
  @Get('/:id')
  async getReview(@Param('id') id: string) {
    return this.reviewsService.getReview(id);
  }

  // PATCH /reviews/:id
  @Patch('/:id')
  @Roles('user', 'admin')
  @UseGuards(RolesGuard)
  async updateReview(@Param('id') id: string, @Body() updateReviewDto: any) {
    return this.reviewsService.updateReview(id, updateReviewDto);
  }

  // DELETE /reviews/:id
  @Delete('/:id')
  @Roles('user', 'admin')
  @UseGuards(RolesGuard)
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}
