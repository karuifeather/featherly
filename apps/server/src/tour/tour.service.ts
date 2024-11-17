import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CRUDFactory } from '../shared/crud.factory';
import { Tour, TourDocument } from './schemas/tour.schema';
import { CreateTourDto } from './dtos/create-tour.dto';
import { UpdateTourDto } from './dtos/update-tour.dto';
import { QueryToursDto } from './dtos/query-tour.dto';

@Injectable()
export class TourService {
  private readonly crud: CRUDFactory<TourDocument>;

  constructor(
    @InjectModel(Tour.name)
    private readonly tourModel: Model<TourDocument>
  ) {
    this.crud = new CRUDFactory<TourDocument>(this.tourModel);
  }

  // CRUD operations
  async getAllTours(queryParams: QueryToursDto) {
    return this.crud.getAll(queryParams);
  }

  async getTour(id: string, populateOptions?: string) {
    return this.crud.getOne(id, populateOptions);
  }

  async createTour(data: CreateTourDto) {
    return this.crud.createOne(data);
  }

  async updateTour(id: string, data: UpdateTourDto) {
    return this.crud.updateOne(id, data);
  }

  async deleteTour(id: string): Promise<string> {
    return this.crud.deleteOne(id);
  }

  // Custom logic: alias top tours
  aliasTopTours(query: QueryToursDto) {
    query.limit = 5;
    query.sort = '-ratingsAverage,price';
    query.fields = 'name,price,ratingsAverage,summary,difficulty';
    return this.getAllTours(query);
  }

  // Aggregation for tour statistics
  async getTourStats() {
    return this.tourModel.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
    ]);
  }

  // Monthly plan aggregation
  async getMonthlyPlan(year: number) {
    return this.tourModel.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTours: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      { $addFields: { month: '$_id' } },
      { $project: { _id: 0 } },
      { $sort: { numTours: -1 } },
      { $limit: 12 },
    ]);
  }

  // Get tours within a distance
  async getToursWithin(distance: number, latlng: string, unit: string) {
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
      throw new BadRequestException('Please provide latitude and longitude.');
    }

    return this.tourModel.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
  }

  // Get distances to tours
  async getDistances(latlng: string, unit: string) {
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
      throw new BadRequestException('Please provide latitude and longitude.');
    }

    return this.tourModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      { $project: { distance: 1, name: 1 } },
    ]);
  }
}
