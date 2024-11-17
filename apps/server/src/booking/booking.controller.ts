import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard) // Protect all routes
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/check-out-session/:tourId')
  async getCheckoutSession(
    @Param('tourId') tourId: string,
    @Req() req,
    @Res() res
  ) {
    const session = await this.bookingService.getCheckoutSession(
      tourId,
      req.user,
      req.protocol,
      req.get('host')
    );
    return res.status(200).json({ status: 'success', session });
  }

  @Post('/webhook-checkout')
  async webhookCheckout(@Req() req, @Res() res) {
    await this.bookingService.webhookCheckout(
      req.body,
      req.headers['stripe-signature']
    );
    return res.status(200).json({ received: true });
  }

  @Get()
  async getBookings() {
    return this.bookingService.getBookings();
  }

  @Post()
  async createBooking(@Body() createBookingDto: any) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Get('/:id')
  async getBooking(@Param('id') id: string) {
    return this.bookingService.getBooking(id);
  }

  @Patch('/:id')
  async updateBooking(@Param('id') id: string, @Body() updateBookingDto: any) {
    return this.bookingService.updateBooking(id, updateBookingDto);
  }

  @Delete('/:id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
