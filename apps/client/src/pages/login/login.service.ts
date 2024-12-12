import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import {
  LoginFailure,
  LoginRequest,
  LoginSuccess,
} from '../../core/states/auth/auth.actions';
import { AxiosService } from '../../core/services/axios.service';
import { NotificationService } from '../../core/services/notification.service';
import { Axios, AxiosError, AxiosInstance } from 'axios';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private _api: AxiosInstance;

  constructor(
    private store: Store,
    private axiosService: AxiosService,
    private notificationService: NotificationService
  ) {
    this._api = this.axiosService.instance;
  }

  async login(email: string, password: string): Promise<boolean> {
    this.store.dispatch(new LoginRequest({ email, password }));

    try {
      const res = await this._api.post('/auth/login', { email, password });

      const { token, data } = res.data;

      this.store.dispatch(new LoginSuccess({ token, user: data.user }));
      this.notificationService.showSuccess('Login successful!');
      return true;
    } catch (error: any) {
      const errorMessage =
        (error.response?.data?.message as string) ||
        (error.message as string) ||
        'Login failed';

      this.store.dispatch(new LoginFailure(errorMessage));
      this.notificationService.showError(errorMessage);

      return false;
    }
  }
}
