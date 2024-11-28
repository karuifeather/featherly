export interface BookingStateModel {
  upcomingBookings: Booking[] | null;
  pastBookings: Booking[] | null;
  loading: boolean;
  error: string | null;
}

export interface Booking {
  id: string;
  tour: {
    slug: string;
    id: string;
    name: string;
    imageCover: string;
    startLocation: {
      address: string;
    };
  };
  user: string;
  price: number;
  createdAt: Date;
  paid: boolean;
  startDate: Date;
}
