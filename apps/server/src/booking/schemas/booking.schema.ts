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
    index: true,
  })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: [true, 'Bookings must have price.'] })
  price: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, required: [true, 'Bookings must have a start date.'] })
  startDate: Date;

  @Prop({ type: Boolean, default: true })
  paid: boolean;

  @Prop({ type: Number, default: 1 })
  totalPeople: number;

  @Prop({ required: true })
  totalPrice: number; // Final price (basePrice * totalPeople)

  // New payment details
  @Prop({
    required: [true, 'Payment method is required.'],
    default: 'credit_card',
  })
  paymentMethod: string; // e.g., 'credit_card', 'paypal', 'stripe'

  @Prop({ type: String })
  transactionId: string; // Unique identifier for the payment transaction

  @Prop({
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  })
  paymentStatus: string; // Status of the payment

  @Prop({ type: String, default: 'stripe' })
  paymentGateway: string; // e.g., 'stripe', 'paypal'

  @Prop({ type: Date })
  paymentDate: Date; // When the payment was processed
}

export interface BookingDocument extends Booking, Document {}

// Create the schema with the correct type
export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.index({ user: 1 });

// Pre Hook to populate tour data on queries
BookingSchema.pre('find', function (next) {
  this.populate({
    path: 'tour',
    select: 'name _id slug  summary startLocation imageCover startDates',
  });

  next();
});
