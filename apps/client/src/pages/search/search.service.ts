import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { AxiosService } from '../../core/services/axios.service';
import { AxiosInstance, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private api: AxiosInstance;
  constructor(private axiosService: AxiosService) {
    this.api = this.axiosService.instance;
  }

  search(params: {
    keyword: string;
    page: number;
    limit: number;
  }): Observable<{ data: any[]; totalPages: number }> {
    return from(
      this.api.get<{ data: any[]; totalPages: number }>('/tours', {
        params,
      })
    ).pipe(
      map(
        (response: AxiosResponse<{ data: any[]; totalPages: number }>) =>
          response.data
      )
    );
  }
}
