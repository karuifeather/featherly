import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async getCheckoutSession(
    tourId: string,
    user: any,
    protocol: string,
    host: string
  ) {
    const tour = await this.tourModel.findById(tourId);

    if (!tour) {
      throw new BadRequestException('Tour not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${protocol}://${host}/my-tours?alert=booking`,
      cancel_url: `${protocol}://${host}/${tour.slug}`,
      customer_email: user.email,
      client_reference_id: tourId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [`${protocol}://${host}/img/tours/${tour.imageCover}`],
            },
            unit_amount: tour.price * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });

    return session;
  }

  async webhookCheckout(payload: any, signature: string) {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET'
    );

    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );
    } catch (err) {
      throw new BadRequestException(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.createBookingCheckout(session);
    }
  }

  private async createBookingCheckout(session: Stripe.Checkout.Session) {
    const tourId = session.client_reference_id;
    const user = await this.userModel.findOne({
      email: session.customer_details.email,
    });
    const price = session.amount_total / 100;

    await this.bookingModel.create({
      tour: tourId,
      user: user._id,
      price,
    });
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

  async updateBooking(id: string, updateBookingDto: any) {
    return this.bookingModel.findByIdAndUpdate(id, updateBookingDto, {
      new: true,
    });
  }

  async deleteBooking(id: string) {
    return this.bookingModel.findByIdAndDelete(id);
  }
}
