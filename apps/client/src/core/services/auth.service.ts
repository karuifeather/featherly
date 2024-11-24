import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private axiosInstance = axios.create({
    baseURL: environment.apiUrl,
    withCredentials: true,
  });

  login(email: string, password: string): Observable<any> {
    return new Observable((observer) => {
      this.axiosInstance
        .post('/auth/login', { email, password })
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
