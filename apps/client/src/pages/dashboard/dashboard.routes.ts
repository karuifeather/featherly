import { Route } from '@angular/router';
import { TourDetailComponent } from '../tourdetails/tour-details.component';
import { FeedComponent } from '../feed/feed.component';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    children: [
      { path: 'tours', component: FeedComponent }, // Tours feed
      { path: 'tours/:tourSlug', component: TourDetailComponent }, // Tour details
    ],
  },
];
