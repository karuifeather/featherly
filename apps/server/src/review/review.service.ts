import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CRUDFactory } from '../shared/crud.factory'; // Import the generic CRUDFactory
import { Review } from './schemas/review.schema';

@Injectable()
export class ReviewService {
  private readonly crudFactory: CRUDFactory<Review>;

  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<Review>
  ) {
    // Manually instantiate CrudFactory
    this.crudFactory = new CRUDFactory<Review>(this.reviewModel);
  }

  async getAllReviews(filter = {}, queryParams = {}) {
    return this.crudFactory.getAll(filter, queryParams);
  }

  async createReview(data: any) {
    return this.crudFactory.createOne(data);
  }

  async getReview(id: string) {
    return this.crudFactory.getOne(id);
  }

  async updateReview(id: string, data: any) {
    return this.crudFactory.updateOne(id, data);
  }

  async deleteReview(id: string) {
    return this.crudFactory.deleteOne(id);
  }
}
