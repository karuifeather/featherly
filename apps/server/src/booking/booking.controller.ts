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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { QueryBookingDto } from './dtos/query-booking.dto';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({
    summary: 'Get a Stripe checkout session for a tour',
    description: 'Returns a checkout session for the specified tour.',
  })
  @ApiParam({
    name: 'tourId',
    description: 'ID of the tour',
    example: '5c88fa8cf4afda39709c295a',
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout session created successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token required.' })
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

  @ApiOperation({
    summary: 'Handle Stripe webhook events',
    description: 'Handles webhook events triggered by Stripe.',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook event handled successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid Stripe signature.' })
  @Post('/webhook-checkout')
  async webhookCheckout(@Req() req, @Res() res) {
    await this.bookingService.webhookCheckout(
      req.body,
      req.headers['stripe-signature']
    );
    return res.status(200).json({ received: true });
  }

  @ApiOperation({
    summary: 'Get all bookings',
    description: 'Fetches a list of all bookings.',
  })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token required.' })
  @Get()
  async getBookings(@Query() queryBookingDto: QueryBookingDto) {
    return this.bookingService.getBookings(queryBookingDto);
  }

  @ApiOperation({
    summary: 'Create a new booking',
    description: 'Creates a new booking using the provided data.',
  })
  @ApiResponse({ status: 201, description: 'Booking created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token required.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @ApiOperation({
    summary: 'Get a specific booking by ID',
    description: 'Fetches details of a booking using its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the booking',
    example: '5c88fa8cf4afda39709c295a',
  })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token required.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  @Get('/:id')
  async getBooking(@Param('id') id: string) {
    return this.bookingService.getBooking(id);
  }

  @ApiOperation({
    summary: 'Update a booking by ID',
    description: 'Updates the details of a booking.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the booking',
    example: '5c88fa8cf4afda39709c295a',
  })
  @ApiResponse({ status: 200, description: 'Booking updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token required.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  @Patch('/:id')
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto
  ) {
    return this.bookingService.updateBooking(id, updateBookingDto);
  }

  @ApiOperation({
    summary: 'Delete a booking by ID',
    description: 'Deletes the specified booking.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the booking',
    example: '5c88fa8cf4afda39709c295a',
  })
  @ApiResponse({ status: 204, description: 'Booking deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token required.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  @Delete('/:id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
