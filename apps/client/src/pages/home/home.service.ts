import { Injectable } from '@angular/core';
import { AxiosService } from '../../core/services/axios.service';
import { Store } from '@ngxs/store';
import { SetRecommendedTours } from '../../core/states/tour/tour.actions';
import { AxiosInstance } from 'axios';
import {
  FetchUpcomingBookings,
  SetUpcomingBookings,
} from '../../core/states/booking/booking.actions';
import { NotificationService } from '../../core/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private api: AxiosInstance;

  constructor(
    private axiosService: AxiosService,
    private store: Store,
    private notificationService: NotificationService
  ) {
    this.api = this.axiosService.instance;
  }

  async fetchRecommendedTours(userId: string) {
    try {
      const response = await this.api.get(
        `/tours/recommended?userId=${userId}`
      );
      this.store.dispatch(new SetRecommendedTours(response.data));
    } catch (error) {
      console.error('Error fetching recommended tours:', error);
      this.notificationService.showError('Error fetching recommended tours');
    }
  }

  async fetchUpcomingBookings(userId: string) {
    this.store.dispatch(new FetchUpcomingBookings());

    try {
      const response = await this.api.get(
        `/bookings/user/${userId}?past=false`
      );
      this.store.dispatch(new SetUpcomingBookings(response.data));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      this.notificationService.showError('Error fetching bookings');
    }
  }
}
