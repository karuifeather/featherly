import { Route } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgotPassword/forgot-password.component';
import { ResetPasswordComponent } from './pages/resetPassword/reset-password.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NonAuthGuard } from './core/guards/non-auth.guard';

export const appRoutes: Route[] = [
  { canActivate: [NonAuthGuard], path: '', component: LandingComponent },
  { canActivate: [NonAuthGuard], path: 'login', component: LoginComponent },
  { canActivate: [NonAuthGuard], path: 'signup', component: SignupComponent },
  {
    canActivate: [NonAuthGuard],
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
  },
  {
    canActivate: [NonAuthGuard],
    path: 'resetPassword',
    component: ResetPasswordComponent,
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then(
        (m) => m.dashboardRoutes
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
