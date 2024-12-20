import { Injectable } from '@angular/core';
import { AxiosService } from '../../core/services/axios.service';
import { AxiosInstance } from 'axios';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _api: AxiosInstance;

  constructor(private axiosService: AxiosService) {
    this._api = this.axiosService.instance;
  }

  createBooking(data: any): Observable<any> {
    return from(this._api.post('/bookings', data));
  }
}
