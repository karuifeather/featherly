import { Booking } from './booking.model';

export class FetchUpcomingBookings {
  static readonly type = '[Booking] Fetch Upcoming Bookings';
}

export class SetUpcomingBookings {
  static readonly type = '[Booking] Set Upcoming Bookings';
  constructor(public payload: Booking[]) {}
}

export class FetchPastBookings {
  static readonly type = '[Booking] Fetch Past Bookings';
}

export class SetPastBookings {
  static readonly type = '[Booking] Set Past Bookings';
  constructor(public payload: Booking[]) {}
}
