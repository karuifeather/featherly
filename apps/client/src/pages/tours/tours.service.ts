import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AxiosInstance } from 'axios';
import { AxiosService } from '../../core/services/axios.service';
import {
  FetchToursFeed,
  SetToursFeed,
} from '../../core/states/tour/tour.actions';
import { NotificationService } from '../../core/services/notification.service';
import { Tour } from '../../core/states/tour/tour.model';

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

  async fetchTours(params: { page: number; limit: number }) {
    this.store.dispatch(new FetchToursFeed());

    try {
      // Include query parameters for pagination
      const response = await this.api.get('/tours', { params });

      // Dispatch the response data to the state
      this.store.dispatch(
        new SetToursFeed({
          tours: response.data.data as Tour[],
          page: params.page,
          limit: params.limit,
          totalPages: response.data.totalPages,
        })
      );

      return response.data;
    } catch (error) {
      console.error('Failed to fetch tours:', error);

      // Display error notification
      this.notificationService.showError('Failed to fetch tours');

      throw error; // Optionally re-throw the error for further handling
    }
  }
}
