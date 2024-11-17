import { NotFoundException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';

export interface QueryParams {
  tourId?: string; // Filter by tour ID
  sort?: string; // Sort fields, e.g., '-price,name'
  page?: number; // Page number for pagination
  limit?: number; // Maximum number of results per page
  fields?: string; // Fields to include, e.g., 'name,price'
}

export class CRUDFactory<T> {
  constructor(private readonly model: Model<T>) {}

  async getAll(
    filter: FilterQuery<T> = {}, // Strongly typed filter keys
    queryParams: QueryParams = {}
  ): Promise<T[]> {
    if (queryParams.tourId) filter = { tour: queryParams.tourId };

    const { sort, page = 1, limit = 10, fields, ...filters } = queryParams;
    const query = this.model.find(filter);

    // Apply additional filters
    if (Object.keys(filters).length > 0) {
      query.find(filters as FilterQuery<T>);
    }

    // Apply sorting
    if (sort) {
      query.sort(sort.split(',').join(' '));
    }

    // Apply field limiting
    if (fields) {
      query.select(fields.split(',').join(' '));
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    query.skip(skip).limit(Number(limit));

    return await query.exec();
  }

  async getOne(id: string, populateOptions?: string): Promise<T> {
    let query = this.model.findById(id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query.exec();
    if (!doc) {
      throw new NotFoundException(`No document found with ID: ${id}`);
    }

    return doc;
  }

  async createOne(data: Partial<T>): Promise<T> {
    const doc = await this.model.create(data);
    return doc;
  }

  async updateOne(id: string, data: Partial<T>): Promise<T> {
    const doc = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      throw new NotFoundException(`No document found with ID: ${id}`);
    }

    return doc;
  }

  async deleteOne(id: string): Promise<string> {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) {
      throw new NotFoundException(`No document found with ID: ${id}`);
    }

    return id;
  }
}
