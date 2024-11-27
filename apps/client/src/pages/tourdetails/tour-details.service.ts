import { Injectable } from '@angular/core';
import { AxiosError, AxiosInstance } from 'axios';
import { AxiosService } from '../../core/services/axios.service';
import { Store } from '@ngxs/store';
import {
  FetchTourDetails,
  SetTourDetails,
} from '../../core/states/tour/tour.actions';
import { Tour } from '../../core/states/tour/tour.model';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TourDetailsService {
  private api: AxiosInstance;

  constructor(
    private axiosService: AxiosService,
    private store: Store,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.api = this.axiosService.instance;
  }

  async getTourDetails(slug: string): Promise<Tour | false> {
    // Dispatch FetchTourDetails to indicate loading
    this.store.dispatch(new FetchTourDetails());

    try {
      const response = await this.api.get(`/tours/by-slug/${slug}`);
      const tour = response.data as Tour;

      // Dispatch SetTourDetails to save the result in the state
      this.store.dispatch(new SetTourDetails({ slug, tour }));
      return tour;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching tour details:', axiosError.message);
      this.notificationService.showError('Error fetching tour details');
      this.router.navigate(['/dashboard/home']);
      return false;
    }
  }
}
