import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard) // Protect all routes
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/check-out-session/:tourId')
  async getCheckoutSession(@Param('tourId') tourId: string) {
    return this.bookingService.getCheckoutSession(tourId);
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
