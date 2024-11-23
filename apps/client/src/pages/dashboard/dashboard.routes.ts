import { Route } from '@angular/router';
import { TourDetailComponent } from '../tourdetails/tour-details.component';
import { FeedComponent } from '../feed/feed.component';
import { HomeComponent } from '../home/home.component';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'tours', component: FeedComponent },
      { path: 'tours/:tourSlug', component: TourDetailComponent },
      // { path: 'bookings', component: BookingsComponent },
      // { path: 'profile', component: ProfileComponent },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
