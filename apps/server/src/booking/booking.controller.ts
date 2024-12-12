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

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body('tourSlug') tourSlug: string,
    @Body('totalPeople') totalPeople: number,
    @Body('startDate') startDate: Date,
    @Req() req,
    @Res() res
  ) {
    const paymentIntent = await this.bookingService.createPaymentIntent(
      tourSlug,
      totalPeople,
      startDate,
      req.user.id
    );

    return res.status(200).json({ status: 'success', ...paymentIntent });
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
    summary: 'Get bookings for a specific user.',
    description: 'Retrieve bookings for a user, filtered by past dates.',
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique ID of the user to retrieve bookings for.',
    example: '67462556f609e5914c8598b8',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or no bookings available for this user.',
  })
  @Get('/user/:userId/past')
  async getPastBookingsByUser(@Param('userId') userId: string) {
    return this.bookingService.getPastBookingsByUser(userId);
  }

  @ApiOperation({
    summary: 'Get bookings for a specific user.',
    description: 'Retrieve bookings for a user, filtered by future dates.',
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique ID of the user to retrieve bookings for.',
    example: '67462556f609e5914c8598b8',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or no bookings available for this user.',
  })
  @Get('/user/:userId/upcoming')
  async getUpcomingBookingsByUser(@Param('userId') userId: string) {
    return this.bookingService.getUpcomingBookingsByUser(userId);
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
