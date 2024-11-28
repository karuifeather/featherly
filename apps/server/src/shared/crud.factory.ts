import { Model, Document } from 'mongoose';
import { BuildQuery } from './buildQuery';

export class CRUDFactory<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async getAll(
    queryParams: Record<string, any>
  ): Promise<{ data: T[] | null; totalPages: number }> {
    const features = new BuildQuery<T>(this.model.find(), queryParams)
      .filter()
      .sort()
      .projectFields()
      .paginate();

    // Count the total documents (before pagination)
    const totalPages = await this.model.countDocuments(
      features.getQuery().getFilter()
    );

    // Fetch paginated results
    const data = await features.getQuery().exec();

    return { data, totalPages };
  }

  async getOne(id: string, populateOptions?: string): Promise<T> {
    let query = this.model.findById(id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query.exec();
    if (!doc) {
      throw new Error(`No document found with ID: ${id}`);
    }

    return doc;
  }

  async createOne(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async updateOne(id: string, data: Partial<T>): Promise<T> {
    const doc = await this.model.findByIdAndUpdate(id, data, {
      new: true, // Return updated document
      runValidators: true, // Apply schema validations
    });

    if (!doc) {
      throw new Error(`No document found with ID: ${id}`);
    }

    return doc;
  }

  async deleteOne(id: string): Promise<string> {
    const doc = await this.model.findByIdAndDelete(id);

    if (!doc) {
      throw new Error(`No document found with ID: ${id}`);
    }

    return id;
  }
}
