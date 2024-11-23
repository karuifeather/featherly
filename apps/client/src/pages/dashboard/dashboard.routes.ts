import { Route } from '@angular/router';
import { TourDetailComponent } from '../tourdetails/tour-details.component';
import { ToursComponent } from '../tours/tours.component';
import { HomeComponent } from '../home/home.component';
import { BookingsComponent } from '../bookings/bookings.component';
import { DashboardComponent } from './dashboard.component';
import { SettingsComponent } from '../settings/settings.component';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'tours', component: ToursComponent },
      { path: 'tours/:tourSlug', component: TourDetailComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
