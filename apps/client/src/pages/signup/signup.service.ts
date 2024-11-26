import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import {
  SignupFailure,
  SignupRequest,
  SignupSuccess,
} from '../../core/states/auth/auth.actions';
import { AxiosService } from '../../core/services/axios.service';
import { NotificationService } from '../../core/services/notification.service';

@Injectable({ providedIn: 'root' })
export class SignupService {
  constructor(
    private store: Store,
    private axiosService: AxiosService,
    private notificationService: NotificationService
  ) {}

  signup(user: {
    fname: string;
    lname: string;
    password: string;
    email: string;
  }): void {
    this.store.dispatch(new SignupRequest());

    this.axiosService.instance
      .post('/auth/signup', user)
      // Handle the response
      .then((response) => {
        const { message } = response.data;

        this.store.dispatch(new SignupSuccess());
        this.notificationService.showSuccess(message);
      })
      // Handle the error
      .catch((error) => {
        const message = error?.response?.data?.message || 'Signup failed';

        this.store.dispatch(new SignupFailure(message));
        this.notificationService.showError(message);
      });
  }
}
