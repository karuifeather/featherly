import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../states/auth/auth.state';

@Injectable({ providedIn: 'root' })
export class NonAuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): boolean {
    const token = this.store.selectSnapshot(AuthState.token);
    if (token) {
      this.router.navigate(['/dashboard']); // Redirect to dashboard if authenticated
      return false;
    } else {
      return true; // Allow access
    }
  }
}
