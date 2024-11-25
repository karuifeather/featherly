import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import {
  LoginFailure,
  LoginRequest,
  LoginSuccess,
} from '../../core/states/auth/auth.actions';
import { AxiosService } from '../../core/services/axios.service';
import { NotificationService } from '../../core/services/notification.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private store: Store,
    private axiosService: AxiosService,
    private notificationService: NotificationService
  ) {}

  login(email: string, password: string): void {
    this.store.dispatch(new LoginRequest({ email, password }));

    this.axiosService.instance
      .post('/auth/login', { email, password })
      .then((response) => {
        const { token, data } = response.data;
        console.log('from here', response.data);
        this.store.dispatch(new LoginSuccess({ token, user: data.user }));
        this.notificationService.showSuccess('Login successful!');
      })
      .catch((error) => {
        const message = error?.response?.data?.message || 'Login failed';
        this.store.dispatch(new LoginFailure(message));
        this.notificationService.showError(message);
      });
  }
}
