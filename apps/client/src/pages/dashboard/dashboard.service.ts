import { Injectable } from '@angular/core';
import { AxiosService } from '../../core/services/axios.service';
import { NotificationService } from '../../core/services/notification.service';
import { Store } from '@ngxs/store';
import { Logout, LogoutRequest } from '../../core/states/auth/auth.actions';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    private axiosService: AxiosService,
    private store: Store,
    private notificationService: NotificationService
  ) {}

  logout(onSuccess: () => void): void {
    this.store.dispatch(new LogoutRequest());

    this.axiosService.instance
      .post('/auth/logout')
      .then(() => {
        this.store.dispatch(new Logout());
        onSuccess();
        this.notificationService.showSuccess('You have been logged out');
      })
      .catch(() => {
        this.notificationService.showError(
          'An error occurred. Please try again'
        );
      });
  }
}
