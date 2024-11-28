import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AxiosInstance } from 'axios';
import { AxiosService } from '../../core/services/axios.service';
import {
  FetchToursFeed,
  SetToursFeed,
} from '../../core/states/tour/tour.actions';
import { NotificationService } from '../../core/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class ToursService {
  private api: AxiosInstance;
  constructor(
    private store: Store,
    private axiosService: AxiosService,
    private notificationService: NotificationService
  ) {
    this.api = this.axiosService.instance;
  }

  async fetchTours() {
    this.store.dispatch(new FetchToursFeed());

    try {
      const response = await this.api.get('/tours');
      this.store.dispatch(new SetToursFeed(response.data));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      this.notificationService.showError('Failed to fetch tours');
    }
  }
}
