import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { BookingService } from '../booking/booking.service';

@Injectable()
export class StripeService {
  stripe: Stripe;
  development: boolean;

  constructor(
    private configService: ConfigService,
    private bookingService: BookingService
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-11-20.acacia',
      }
    );

    this.development =
      this.configService.get<string>('NODE_ENV') === 'development';
  }

  async handleWebhook(
    req: Request,
    res: Response,
    sig: string | string[]
  ): Promise<void> {
    let event: Stripe.Event;

    let webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (this.development) {
      webhookSecret = this.configService.get<string>(
        'STRIPE_WEBHOOK_SECRET_TEST'
      );
    }

    try {
      // Verify the event signature
      event = this.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        if (this.development)
          console.log(`Payment for ${paymentIntent.amount / 100} succeeded.`);

        // Extract metadata from PaymentIntent
        const bookingId = paymentIntent.metadata.bookingId;

        // Update booking details in the database
        await this.bookingService.updateBooking(bookingId, {
          paymentStatus: 'completed',
          paid: true,
          paymentDate: new Date(),
          transactionId: paymentIntent.id,
          paymentGateway: 'stripe',
          paymentMethod: 'card',
        });
        break;
      }

      default:
        if (this.development) {
          console.warn(`Unhandled event type: ${event.type}`);
        }
        break;
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  }
}
