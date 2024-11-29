import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AxiosService } from '../../core/services/axios.service';
import { AxiosInstance } from 'axios';
import { SetPopularTours } from '../../core/states/tour/tour.actions';

@Injectable({ providedIn: 'root' })
export class LandingService {
  private api: AxiosInstance;

  constructor(private axiosService: AxiosService, private store: Store) {
    this.api = this.axiosService.instance;
  }

  async fetchPopularTours() {
    try {
      const response = await this.api.get('/tours/popular');
      this.store.dispatch(new SetPopularTours(response.data.data));
    } catch (error) {
      console.error('Error fetching popular tours:', error);
    }
  }

  // async fetchToursFeed() {
  //   try {
  //     const response = await this.api.get('/tours');
  //     this.store.dispatch(new SetToursFeed(response.data));
  //   } catch (error) {
  //     console.error('Error fetching tours feed:', error);
  //   }
  // }
}
