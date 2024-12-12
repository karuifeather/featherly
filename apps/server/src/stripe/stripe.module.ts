import { Module } from '@nestjs/common';
import { BookingModule } from '../booking/booking.module';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  imports: [BookingModule],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [],
})
export class StripeModule {}
