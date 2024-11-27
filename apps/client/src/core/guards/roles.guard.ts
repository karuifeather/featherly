import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../states/auth/auth.model';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store
      .select((state) => state.auth.user)
      .pipe(
        map((user: User | null) => {
          if (user?.role === 'admin') {
            return true;
          }

          this.notificationService.showError(
            'You do not have permission to access this page'
          );

          // Redirect if user is not an admin
          this.router.navigate(['/unauthorized']);
          return false;
        })
      );
  }
}
