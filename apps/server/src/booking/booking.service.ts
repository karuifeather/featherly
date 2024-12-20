import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Tour } from '../tour/schemas/tour.schema';
import { User } from '../user/schemas/user.schema';
import { CRUDFactory } from '../shared/crud.factory';
import { QueryBookingDto } from './dtos/query-booking.dto';
import { CreateBookingDto } from './dtos/create-booking.dto';

@Injectable()
export class BookingService {
  private readonly stripe: Stripe;
  private readonly crud: CRUDFactory<BookingDocument>;

  constructor(
    @InjectModel('Booking') private readonly bookingModel: Model<Booking>,
    @InjectModel('Tour') private readonly tourModel: Model<Tour>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly configService: ConfigService
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-11-20.acacia',
      }
    );

    this.crud = new CRUDFactory<BookingDocument>(this.bookingModel);
  }

  async createPaymentIntent(
    tourSlug: string,
    totalPeople: number,
    startDate: Date,
    userId: string
  ) {
    const tour = await this.tourModel.findOne({ slug: tourSlug }).exec();

    if (!tour) {
      throw new BadRequestException('Tour not found');
    }

    const totalPrice = tour.price * totalPeople; // Calculate the total price

    // Create a booking with default payment status
    const booking = new this.bookingModel({
      tour: tour.id as mongoose.Types.ObjectId,
      user: new mongoose.Types.ObjectId(userId),
      price: tour.price,
      totalPeople: totalPeople,
      totalPrice: totalPrice,
      startDate: new Date(startDate),
      paymentStatus: 'pending',
      paid: false,
    });

    await booking.save();

    // Create a PaymentIntent in Stripe
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: totalPrice * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        bookingId: booking.id,
        userId: userId,
        tourId: tour.id,
      },
    });

    // Update booking with the transactionId
    booking.transactionId = paymentIntent.id;
    await booking.save();

    return {
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.id,
      totalPrice: totalPrice,
    };
  }

  async getBookings(queryBookingDto: QueryBookingDto) {
    return this.crud.getAll(queryBookingDto);
  }

  async createBooking(createBookingDto: CreateBookingDto) {
    return this.crud.createOne(createBookingDto);
  }

  async getBooking(id: string) {
    return this.crud.getOne(id);
  }

  async getPastBookingsByUser(userId: string): Promise<Booking[]> {
    const currentDate = new Date(); // Current date

    return this.bookingModel
      .find({ user: userId, startDate: { $lt: currentDate } })
      .exec();
  }

  async getUpcomingBookingsByUser(userId: string): Promise<Booking[]> {
    const currentDate = new Date(); // Current date

    return this.bookingModel
      .find({ user: userId, startDate: { $gte: currentDate } })
      .exec();
  }

  async updateBooking(id: string, updateBookingDto: any) {
    return this.bookingModel.findByIdAndUpdate(id, updateBookingDto, {
      new: true,
    });
  }

  async deleteBooking(id: string) {
    return this.bookingModel.findByIdAndDelete(id);
  }
}
