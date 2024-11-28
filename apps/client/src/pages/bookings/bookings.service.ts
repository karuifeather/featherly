import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';
import { AxiosService } from '../../core/services/axios.service';
import { Store } from '@ngxs/store';
import {
  FetchPastBookings,
  FetchUpcomingBookings,
  SetPastBookings,
  SetUpcomingBookings,
} from '../../core/states/booking/booking.actions';
import { NotificationService } from '../../core/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private api: AxiosInstance;

  constructor(
    private axiosService: AxiosService,
    private store: Store,
    private notificationService: NotificationService
  ) {
    this.api = this.axiosService.instance;
  }

  async fetchUpcomingBookings(userId: string) {
    this.store.dispatch(new FetchUpcomingBookings());

    try {
      const response = await this.api.get(`/bookings/user/${userId}/upcoming`);
      this.store.dispatch(new SetUpcomingBookings(response.data));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      this.notificationService.showError('Error fetching bookings');
    }
  }

  async fetchPastBookings(userId: string) {
    this.store.dispatch(new FetchPastBookings());

    try {
      const response = await this.api.get(`/bookings/user/${userId}/past`);
      this.store.dispatch(new SetPastBookings(response.data));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      this.notificationService.showError('Error fetching bookings');
    }
  }
}
