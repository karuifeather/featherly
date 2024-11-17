import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CRUDFactory } from '../shared/crud.factory'; // Import the generic CRUDFactory
import { Review } from './schemas/review.schema';
import { QueryReviewsDto } from './dtos/query-review.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/update-review.dto';

@Injectable()
export class ReviewService {
  private readonly crudFactory: CRUDFactory<Review>;

  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<Review>
  ) {
    this.crudFactory = new CRUDFactory<Review>(this.reviewModel);
  }

  async getAllReviews(queryParams: QueryReviewsDto = {}) {
    return this.crudFactory.getAll(queryParams);
  }

  async createReview(data: CreateReviewDto) {
    return this.crudFactory.createOne(data);
  }

  async getReview(id: string) {
    return this.crudFactory.getOne(id);
  }

  async updateReview(id: string, data: UpdateReviewDto) {
    return this.crudFactory.updateOne(id, data);
  }

  async deleteReview(id: string) {
    return this.crudFactory.deleteOne(id);
  }
}
