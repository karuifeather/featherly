import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret._id;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret._id;
    },
  },
})
export class Booking extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'A booking must have a tour.'],
  })
  tour: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A booking must belong to a user.'],
  })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: [true, 'Bookings must have price.'] })
  price: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Boolean, default: true })
  paid: boolean;
}

export interface BookingDocument extends Booking, Document {}

// Create the schema with the correct type
export const BookingSchema = SchemaFactory.createForClass(Booking);

// Pre Hook to populate tour data on queries
BookingSchema.pre('find', function (next) {
  this.populate({
    path: 'tour',
    select: 'name _id',
  });

  next();
});
