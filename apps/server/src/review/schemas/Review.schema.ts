import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Tour } from '../tour/schemas/tour.schema';
import { User } from '../user/schemas/user.schema';

export interface ReviewDocument extends Document {
  review: string;
  rating: number;
  createdAt: Date;
  tour: Tour;
  user: User;
  constructor: typeof Review; // This is important for static methods
}

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Review extends Document {
  @Prop({ required: [true, 'A review cannot be empty.'], trim: true })
  review: string;

  @Prop({
    required: [true, 'A review must have a rating.'],
    min: [1, 'A review cannot have rating below 1.'],
    max: [5, 'A review cannot be more than 5.'],
  })
  rating: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour.'],
  })
  tour: Tour;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user.'],
  })
  user: User;
}

// Create the schema
export const ReviewSchema = SchemaFactory.createForClass(Review);

// Index to make sure there is only one review per user for a tour
ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// TODO: Add a static method to calculate average rating
