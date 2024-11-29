import { Route } from '@angular/router';
import { TourDetailComponent } from '../tourdetails/tour-details.component';
import { ToursComponent } from '../tours/tours.component';
import { HomeComponent } from '../home/home.component';
import { BookingsComponent } from '../bookings/bookings.component';
import { DashboardComponent } from './dashboard.component';
import { SettingsComponent } from '../settings/settings.component';
import { ProfileComponent } from '../profile/profile.component';
import { CreateTourComponent } from '../createTour/create-tour.component';
import { RoleGuard } from '../../core/guards/roles.guard';
import { SearchResultsComponent } from '../search/search.component';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'tours', component: ToursComponent },
      { path: 'tours/:tourSlug', component: TourDetailComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'search', component: SearchResultsComponent },
      {
        canActivate: [RoleGuard],
        path: 'create/tours',
        component: CreateTourComponent,
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
