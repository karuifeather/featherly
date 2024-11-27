import { Injectable } from '@angular/core';
import { AxiosService } from '../../core/services/axios.service';
import { Store } from '@ngxs/store';
import { SetRecommendedTours } from '../../core/states/tour/tour.actions';
import { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private api: AxiosInstance;

  constructor(private axiosService: AxiosService, private store: Store) {
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
    }
  }
}
