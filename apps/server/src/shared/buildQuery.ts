import { Query } from 'mongoose';

export class BuildQuery<T> {
  private query: Query<T[], T>;
  private queryString: {
    sort?: string;
    fields?: string;
    limit?: number;
    page?: number;
    keyword?: string;
    filters?: Record<string, string | number>;
  };

  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(): this {
    const filters = this.queryString.filters || {};

    // Handle keyword search using the text index
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword;

      // Use $text for full-text search
      this.query = this.query.find({
        $text: { $search: keyword },
      });
    }

    // Apply additional filters if provided
    if (Object.keys(filters).length > 0) {
      let queryStr = JSON.stringify(filters);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      const parsedQuery = JSON.parse(queryStr) as Record<string, any>;

      // Combine text search with additional filters
      this.query = this.query.find(parsedQuery);
    }

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  projectFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields) as Query<T[], T>;
    } else {
      this.query = this.query.select('-__v') as Query<T[], T>;
    }
    return this;
  }

  paginate(): this {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  getQuery(): Query<T[], T> {
    return this.query;
  }

  getFilter(): Record<string, any> {
    return this.filter; // Return the applied filters
  }
}
